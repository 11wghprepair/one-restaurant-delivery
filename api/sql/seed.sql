INSERT INTO menu_categories(name) VALUES ('Burgers'), ('Sides'), ('Drinks');
INSERT INTO menu_items(category_id, name, price, description) VALUES
(1, 'Classic Burger', 149, 'Beef patty with lettuce & sauce', true),
(1, 'Veg Burger', 119, 'Crispy veg patty', true),
(2, 'French Fries', 69, 'Crispy fries', true),
(3, 'Coke', 49, 'Chilled coke', true);
