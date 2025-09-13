SIGNUP = '''
INSERT INTO user (user_name, email_id, user_password, salt) VALUES (%s, %s, %s, %s)
'''

LOGIN= '''SELECT * FROM  user WHERE email_id = %s '''

FETCH_EMAIL= '''
SELECT user_name,email_id,image,user_id,phone FROM user WHERE user_id=%s
'''

UPDATE_USER='''
UPDATE user SET user_name=%s,email_id=%s,phone=%s,image=%s WHERE user_id=%s
'''

FETCH_EXPENSE='''
SELECT expense.exp_amount,expense.exp_date,expense.exp_description,expense.exp_id,category.cat_name 
FROM expense,category 
WHERE expense.cat_id=category.cat_id AND user_id=%s
'''

CREATE_EXPENSE='''
INSERT INTO expense (user_id,cat_id,exp_date,exp_amount,exp_description) VALUES (%s,%s,%s,%s,%s)'''

DELETE_EXPENSE = '''
DELETE FROM expense WHERE user_id=%s AND exp_id=%s
'''   

FETCH_CATEGORY= ''' SELECT * FROM category '''

INSERT_CATEGORY='''INSERT INTO category (cat_name) VALUES (%s)'''

SELECT_PIE_EXPENSES = '''
SELECT c.cat_name,c.cat_id, SUM(e.exp_amount) AS amount
FROM expense e
INNER JOIN category c ON e.cat_id = c.cat_id
WHERE YEAR(e.exp_date) = YEAR(CURDATE())
  AND e.user_id = %s
GROUP BY c.cat_id, c.cat_name
ORDER BY amount DESC;
'''

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

CHECK_PASSWORD='''SELECT * FROM  user WHERE user_id = %s '''

CHANGE_PASSWORD='''
UPDATE user SET user_password = %s,salt=%s WHERE user_id = %s
'''

FORGOT_PASSWORD='''SELECT user_id FROM user WHERE email_id =%s'''