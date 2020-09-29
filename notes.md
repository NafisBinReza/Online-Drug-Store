referer:req.headers.referer

if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
                                res.redirect(req.body.referer);
                            }
                            else {
                                res.redirect(path);
                            }

<input type="hidden" name="referer" value= <%= referer %> >

CREATE TABLE drug_details (
	DRUG_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    DRUG_NAME varchar(25),
    DRUG_IMAGE varchar(100),
    DRUG_TYPE varchar(20),
    DRUG_PRICE int,
    DRUG_PHARMA varchar(30), 
    DRUG_INDICATION text, 
    DRUG_FOR varchar(20),
    ADDED_BY varchar(38),
    ADDED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE drug_details 
    ADD COLUMN DRUG_GENERIC_NAME varchar(50) NOT NULL
    ADD COLUMN DRUG_PHARMACOLOGY text,  
    ADD COLUMN DRUG_DOSAGE text NOT NULL, 
    ADD COLUMN DRUG_THERAPEUTIC_CLASS text,  
    ADD COLUMN DRUG_INTERACTION text,  
    ADD COLUMN DRUG_CONTRAINDICATIONS text,  
    ADD COLUMN DRUG_SIDE_EFFECTS text,  
    ADD COLUMN DRUG_PREGNANCY_AND_LACTATION text,  
    ADD COLUMN DRUG_PRECAUTIONS_AND_WARNINGS text,  
    ADD COLUMN DRUG_USE_IN_SPECIAL_POPULATION text, 
	ADD COLUMN DRUG_OVERDOSE_EFFECTS text,  
    ADD COLUMN DRUG_STORAGE_CONDITIONS text 


CREATE TABLE USER_DETAIL (
	USER_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    USER_PASSWORD text,
    USER_NAME varchar(30),
    USER_TYPE varchar(10) DEFAULT 'user',
    USER_BDAY TIMESTAMP,
    USER_GENDER varchar(10),
    USER_EMAIL varchar(30),
    USER_ADDRESS text,
    USER_PHONE_NO varchar(20),
    USER_ADDED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments_details (
	COMMENT_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    COMMENT_TEXT text NOT NULL,
    DRUG_ID varchar(38),
    COMMENT_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    USER_ID varchar(38),
    FOREIGN KEY (USER_ID) REFERENCES user_detail(USER_ID),
    FOREIGN KEY (DRUG_ID) REFERENCES drug_details(DRUG_ID)
)

CREATE TABLE cart_details (
	CART_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    DRUG_ID varchar(38) NOT NUll,
    USER_ID varchar(38) NOT null,
    CART_QUANTITY int NOT null,
    CART_PRICE double(10,4) NOT null,
    FOREIGN KEY (USER_ID) REFERENCES user_detail(USER_ID),
    FOREIGN KEY (DRUG_ID) REFERENCES drug_details(DRUG_ID)
)

CREATE TABLE order_details (
	ORDER_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    DRUG_ID varchar(38) NOT null,
    USER_ID varchar(38) NOT null,
    ORDER_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ORDER_QUANTITY int NOT null,
    FOREIGN KEY (USER_ID) REFERENCES user_detail(USER_ID),
    FOREIGN KEY (DRUG_ID) REFERENCES drug_details(DRUG_ID)
)

ALTER TABLE order_details 
    ADD COLUMN ORDER_TYPE varchar(10) NOT NULL


CREATE TABLE delivered (
	DELIVERED_ID varchar(38) PRIMARY KEY DEFAULT UUID(),
    DRUG_ID char(38) NOT null,
    USER_ID char(38) NOT null,
    DELIVERED_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    DELIVERED_QUANTITY int NOT null,
    FOREIGN KEY (USER_ID) REFERENCES user_detail(USER_ID),
    FOREIGN KEY (DRUG_ID) REFERENCES drug_details(DRUG_ID)
)


// DELETE FROM order_details WHERE USER_ID = '66e60b0d-bc2c-11ea-97bf-38d5470f2067' AND ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '712e81e7-bc77-11ea-97bf-38d5470f2067');
// INSERT INTO delivered (DRUG_ID, USER_ID, DELIVERED_QUANTITY) SELECT o.DRUG_ID, o.USER_ID, o.ORDER_QUANTITY FROM order_details as o WHERE o.USER_ID = '66e60b0d-bc2c-11ea-97bf-38d5470f2067' AND o.ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '712e81e7-bc77-11ea-97bf-38d5470f2067'); 
