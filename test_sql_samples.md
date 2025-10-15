# ตัวอย่าง SQL Queries สำหรับทดสอบ

## ตัวอย่างที่ 1: Basic SELECT
```sql
select u.id, u.name, u.email, p.title, p.content, c.name as category from users u inner join posts p on u.id = p.user_id left join categories c on p.category_id = c.id where u.active = 1 and p.published_at is not null order by p.created_at desc limit 10
```

## ตัวอย่างที่ 2: Complex Query with CTE
```sql
with monthly_sales as (select extract(month from order_date) as month, extract(year from order_date) as year, sum(total_amount) as total_sales from orders where order_date >= '2024-01-01' group by extract(year from order_date), extract(month from order_date)), top_customers as (select customer_id, sum(total_amount) as total_spent from orders where order_date >= '2024-01-01' group by customer_id order by total_spent desc limit 5) select ms.month, ms.year, ms.total_sales, tc.customer_id, tc.total_spent from monthly_sales ms cross join top_customers tc order by ms.year, ms.month, tc.total_spent desc
```

## ตัวอย่างที่ 3: INSERT with VALUES
```sql
insert into products (name, description, price, category_id, created_at) values ('Laptop Pro 15', 'High-performance laptop for professionals', 1299.99, 1, now()), ('Wireless Mouse', 'Ergonomic wireless mouse with 3-year battery', 29.99, 2, now()), ('Monitor 4K', '27-inch 4K UHD monitor with HDR', 399.99, 1, now())
```

## ตัวอย่างที่ 4: UPDATE with JOIN
```sql
update orders o set status = 'shipped', shipped_at = now() from customers c where o.customer_id = c.id and c.premium = true and o.status = 'processing' and o.created_at >= '2024-10-01'
```