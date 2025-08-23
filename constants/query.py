SELECT_TOP3_EXPENSES_OF_LAST_3_MONTHS_EACH ='''
SELECT 
    JSON_MERGE(
        JSON_OBJECT('month_', y.month_),
        JSON_OBJECTAGG(y.cat_name, y.amount)
    ) AS result
FROM (
    SELECT x.*,
           DENSE_RANK() OVER (PARTITION BY x.month_ ORDER BY amount DESC) AS rnk
    FROM (
        SELECT 
            MONTH(e.exp_date) AS month_,
            e.cat_id,
            c.cat_name,
            SUM(exp_amount) OVER (PARTITION BY MONTH(e.exp_date), YEAR(e.exp_date), cat_id) AS amount
        FROM expense e
        INNER JOIN category c ON e.cat_id = c.cat_id
        WHERE YEAR(e.exp_date) = YEAR(CURDATE())
          AND e.user_id = %s
    ) x
) y
WHERE y.rnk < 4
GROUP BY y.month_
ORDER BY y.month_;
'''

SELECT_PIE_EXPENSES = '''
SELECT c.cat_name,c.cat_id, SUM(e.exp_amount) AS amount
FROM expense e
INNER JOIN category c ON e.cat_id = c.cat_id
WHERE YEAR(e.exp_date) = YEAR(CURDATE())
  AND e.user_id = %s
GROUP BY c.cat_id, c.cat_name
ORDER BY amount DESC;
'''