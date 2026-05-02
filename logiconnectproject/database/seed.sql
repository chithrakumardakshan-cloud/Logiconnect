INSERT INTO users (type, name, email, password, mobile, city, country, address1, address2, approval_status, services_offered)
VALUES
('ADMIN','ADMIN','admin@logiconnect.com','Admin@123','','','','','','PENDING','[]'::jsonb),
('COMPANY','GSD','company@logiconnect.com','Test@123','+94 777247671','Colombo','Sri Lanka','No. 01','Main Road','APPROVED','["FCL","LCL","Air Freight","Sea Freight","Customs Clearance","Inland Transportation","Warehousing"]'::jsonb),
('CUSTOMER','SEYMIYON','customer@logiconnect.com','Test@123','+94 771234567','Wattala','Sri Lanka','No. 10','Station Road',NULL,'[]'::jsonb)
ON CONFLICT (email) DO NOTHING;
