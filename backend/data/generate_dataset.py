"""
Generate a realistic 2-year retail sales dataset for Predictive Analytics (CSE3141)
Covers:
- Trend, Seasonality, Weekly Cyclicality, Promotional Lifts, Price Elasticity, Noise
- Outliers (for IQR & Box Plot analysis in syllabus)
- Features suitable for Regression, Time Series (ARIMA/SARIMA), and Classification
"""
import numpy as np
import csv
from datetime import datetime, timedelta

def generate_sales_data(filepath="backend/data/retail_sales_data.csv"):
    np.random.seed(42)
    start_date = datetime(2024, 1, 1)
    num_days = 731  # 2 full years (2024 leap year + 2025)
    
    categories = {
        'Grocery': {
            'base_units': 450,
            'price': 15.0,
            'price_std': 1.5,
            'trend_slope': 0.12,
            'weekend_boost': 1.35,
            'promo_boost': 1.40,
            'holiday_boost': 1.55,
            'noise_scale': 25
        },
        'Electronics': {
            'base_units': 120,
            'price': 220.0,
            'price_std': 25.0,
            'trend_slope': 0.08,
            'weekend_boost': 1.45,
            'promo_boost': 1.85,
            'holiday_boost': 2.30,
            'noise_scale': 18
        },
        'Apparel': {
            'base_units': 240,
            'price': 45.0,
            'price_std': 6.0,
            'trend_slope': 0.10,
            'weekend_boost': 1.50,
            'promo_boost': 1.60,
            'holiday_boost': 1.90,
            'noise_scale': 22
        },
        'Home & Kitchen': {
            'base_units': 180,
            'price': 65.0,
            'price_std': 8.0,
            'trend_slope': 0.09,
            'weekend_boost': 1.30,
            'promo_boost': 1.45,
            'holiday_boost': 1.70,
            'noise_scale': 19
        }
    }
    
    # Major retail holidays/festivals (month, day)
    holidays_calendar = {
        (1, 1): "New Year's Day",
        (1, 26): "Republic Day Sale",
        (3, 25): "Holi Festive Sale",
        (8, 15): "Independence Mega Sale",
        (10, 2): "Gandhi Jayanti Special",
        (10, 24): "Dussehra Super Deal",
        (11, 1): "Diwali Mega Bonanza",
        (11, 29): "Black Friday Global Deal",
        (12, 25): "Christmas / Year-End Gala",
        (12, 31): "New Year's Eve Rush"
    }

    rows = []
    
    for day_idx in range(num_days):
        current_date = start_date + timedelta(days=day_idx)
        date_str = current_date.strftime("%Y-%m-%d")
        month = current_date.month
        day_of_week = current_date.weekday() # 0 = Monday, 6 = Sunday
        day_name = current_date.strftime("%A")
        is_weekend = 1 if day_of_week in [5, 6] else 0
        
        # Check holiday
        is_holiday = 1 if (month, current_date.day) in holidays_calendar else 0
        
        # Promotions run periodically (every ~10-14 days or on holidays)
        is_promotion = 1 if (day_idx % 11 == 0 or day_idx % 12 == 0 or is_holiday) else 0
        discount_pct = round(float(np.random.choice([0.0, 0.05, 0.10, 0.15, 0.20, 0.25])), 2) if is_promotion else 0.0
        
        for cat_name, params in categories.items():
            base = params['base_units']
            trend = params['trend_slope'] * day_idx
            
            # Annual seasonality (sine wave: peak in Q4 holiday season Oct-Dec)
            annual_seasonality = 1.0 + 0.22 * np.sin(2 * np.pi * (day_idx - 60) / 365.25)
            
            # Weekly seasonality
            weekly_factor = params['weekend_boost'] if is_weekend else (0.92 if day_of_week == 0 else 1.0)
            
            # Promotional & holiday multipliers
            promo_factor = (1.0 + (params['promo_boost'] - 1.0) * (discount_pct / 0.20)) if is_promotion and discount_pct > 0 else 1.0
            holiday_factor = params['holiday_boost'] if is_holiday else 1.0
            
            # Noise
            noise = np.random.normal(0, params['noise_scale'])
            
            # Calculate raw units
            expected_units = (base + trend) * annual_seasonality * weekly_factor * promo_factor * holiday_factor + noise
            units_sold = max(10, int(round(expected_units)))
            
            # Add synthetic outliers (~1% of days) for CSE3141 IQR / Z-Score demonstration
            if np.random.rand() < 0.012:
                units_sold = int(units_sold * np.random.choice([2.4, 2.7, 0.35]))
                
            unit_price = max(5.0, round(float(np.random.normal(params['price'], params['price_std'])), 2))
            actual_price = round(unit_price * (1.0 - discount_pct), 2)
            revenue = round(units_sold * actual_price, 2)
            competitor_price = round(unit_price * np.random.uniform(0.92, 1.08), 2)
            marketing_spend = round(float(np.random.uniform(500, 3500) if is_promotion else np.random.uniform(100, 600)), 2)
            
            rows.append({
                'date': date_str,
                'category': cat_name,
                'units_sold': units_sold,
                'unit_price': unit_price,
                'discount_pct': discount_pct,
                'revenue': revenue,
                'is_promotion': is_promotion,
                'is_holiday': is_holiday,
                'day_of_week': day_of_week,
                'day_name': day_name,
                'month': month,
                'year': current_date.year,
                'competitor_price': competitor_price,
                'marketing_spend': marketing_spend
            })
            
    # Calculate high_demand_surge threshold per category (75th percentile)
    cat_units = {}
    for r in rows:
        cat_units.setdefault(r['category'], []).append(r['units_sold'])
        
    cat_thresholds = {c: np.percentile(vals, 75) for c, vals in cat_units.items()}
    
    for r in rows:
        r['high_demand_surge'] = 1 if r['units_sold'] >= cat_thresholds[r['category']] else 0
        
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        fieldnames = [
            'date', 'category', 'units_sold', 'unit_price', 'discount_pct',
            'revenue', 'is_promotion', 'is_holiday', 'day_of_week', 'day_name',
            'month', 'year', 'competitor_price', 'marketing_spend', 'high_demand_surge'
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Successfully generated {len(rows)} records in {filepath}")

if __name__ == '__main__':
    generate_sales_data()
