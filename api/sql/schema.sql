CREATE TABLE menu_categories (id serial primary key, name text not null);
CREATE TABLE menu_items (id serial primary key, category_id int references menu_categories(id), name text, price numeric, description text, is_available boolean default true);
CREATE TABLE orders (id serial primary key, user_id int, status text, total_amount numeric, payment_status text, razorpay_order_id text, address json, created_at timestamp default now());
