WITH admin AS (
    SELECT id FROM users WHERE email = 'admin@frontdesk.dev'
)
INSERT INTO inquiries (id, customer_name, customer_email, channel, message_text, received_at, status)
VALUES
    -- 1. Jordan Mills — NEW — weekend holiday hours
    (
        'a1111111-1111-1111-1111-111111111111',
        'Jordan Mills',
        'jordan.mills@example.com',
        'WEB_FORM',
        'Hi there! I was wondering if your store will have adjusted hours this upcoming holiday weekend. Are you open on the holiday itself? I''d love to stop by on Saturday but want to make sure you''re open before I make the drive.',
        now() - interval '2 hours',
        'NEW'
    ),
    -- 2. Casey Park — NEW — damaged item
    (
        'a2222222-2222-2222-2222-222222222222',
        'Casey Park',
        'casey.park@example.com',
        'EMAIL',
        'I received my order #1045 yesterday and unfortunately the ceramic vase arrived with a large crack along the side. The packaging seemed intact, so I think it may have been damaged before shipping. Could you please let me know how to proceed with a replacement or refund?',
        now() - interval '5 hours',
        'NEW'
    ),
    -- 3. Riley Chen — NEW — gift wrapping
    (
        'a3333333-3333-3333-3333-333333333333',
        'Riley Chen',
        'riley.chen@example.com',
        'WEB_FORM',
        'Hello! I''m planning to order a few items as birthday gifts and was wondering if you offer gift wrapping services for online orders. If so, is there an additional fee and can I include a personal message with the gift?',
        now() - interval '8 hours',
        'NEW'
    ),
    -- 4. Morgan Davis — DRAFTED — return policy for opened item
    (
        'a4444444-4444-4444-4444-444444444444',
        'Morgan Davis',
        'morgan.davis@example.com',
        'EMAIL',
        'I purchased a small lamp from your store last week and after opening the box I realized the color doesn''t match my living room at all. The lamp itself is in perfect condition — I just want to return it. Can I still return an item that has been opened, or does it need to be in the original sealed packaging?',
        now() - interval '12 hours',
        'DRAFTED'
    ),
    -- 5. Taylor Brooks — DRAFTED — bulk discount
    (
        'a5555555-5555-5555-5555-555555555555',
        'Taylor Brooks',
        'taylor.brooks@designstudio.com',
        'MANUAL',
        'I''m an interior designer working on a hospitality project and I''m interested in purchasing several of your artisan tables in bulk. Do you offer any trade discounts or wholesale pricing for design professionals ordering multiple pieces? I''d need about 12 units and would love to discuss pricing.',
        now() - interval '15 hours',
        'DRAFTED'
    ),
    -- 6. Avery Thompson — APPROVED — shipping to rural address
    (
        'a6666666-6666-6666-6666-666666666666',
        'Avery Thompson',
        'avery.thompson@example.com',
        'EMAIL',
        'Hi! I live in a fairly rural area and sometimes shipping takes much longer than expected with other stores. Could you give me an idea of how long standard shipping typically takes to a rural address? I want to make sure my order arrives before I leave for a trip next week.',
        now() - interval '20 hours',
        'APPROVED'
    ),
    -- 7. Quinn Rivera — APPROVED — walnut side table stock
    (
        'a7777777-7777-7777-7777-777777777777',
        'Quinn Rivera',
        'quinn.rivera@example.com',
        'WEB_FORM',
        'I''ve been eyeing the walnut side table on your website for a few weeks now and it''s been showing as out of stock. Do you have an estimated date for when it will be back in stock? I''d really love to get my hands on one for my reading nook.',
        now() - interval '26 hours',
        'APPROVED'
    ),
    -- 8. Sam Nguyen — SENT — tracking an existing order
    (
        'a8888888-8888-8888-8888-888888888888',
        'Sam Nguyen',
        'sam.nguyen@example.com',
        'EMAIL',
        'I placed an order three days ago and received a confirmation email, but I haven''t gotten any shipping information yet. Is there a way to track my order? I just want to make sure everything is on track.',
        now() - interval '32 hours',
        'SENT'
    ),
    -- 9. Drew Kim — NEW — loyalty program
    (
        'a9999999-9999-9999-9999-999999999999',
        'Drew Kim',
        'drew.kim@example.com',
        'WEB_FORM',
        'Hey! I''ve been shopping at Maple & Co. for a while now and was wondering if you have a loyalty or rewards program for regular customers. I''d love to earn some perks for all the purchases I''ve been making!',
        now() - interval '40 hours',
        'NEW'
    ),
    -- 10. Frankie Lee — NEW — custom engraving
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Frankie Lee',
        'frankie.lee@example.com',
        'MANUAL',
        'I''m looking for a unique wedding gift and noticed some of your wooden items could possibly be personalized. Do you offer custom engraving services on any of your products? I''d like to have a name and date engraved on a serving board if that''s something you can do.',
        now() - interval '48 hours',
        'NEW'
    ),
    -- 11. Alex Zhao — NEW — international shipping
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Alex Zhao',
        'alex.zhao@example.com',
        'EMAIL',
        'Hello! I''m based in Canada and was hoping to place an order from your online store. Do you ship internationally to Canada? If so, are there any additional customs fees or duties I should expect?',
        now() - interval '60 hours',
        'NEW'
    ),
    -- 12. Jordan Silva — FAILED — cancel/modify order
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'Jordan Silva',
        'jordan.silva@example.com',
        'WEB_FORM',
        'I placed an order this morning but immediately realized I entered the wrong shipping address. Is it possible to cancel or modify the order before it goes out? Please let me know as soon as possible — I really don''t want it sent to the wrong place.',
        now() - interval '70 hours',
        'FAILED'
    );

-- Replies for DRAFTED inquiries
WITH admin AS (SELECT id FROM users WHERE email = 'admin@frontdesk.dev')
INSERT INTO replies (id, inquiry_id, draft_text, ai_model_used, generated_at, last_edited_by_user_id)
VALUES
    -- 4. Morgan Davis — DRAFTED
    (
        'b4444444-4444-4444-4444-444444444444',
        'a4444444-4444-4444-4444-444444444444',
        'Thank you for reaching out, Morgan! We understand that sometimes items don''t work out as expected. Since the lamp is in perfect condition, you are welcome to return it within 30 days of purchase even if the box has been opened — we just ask that all original parts are included. Please start the return through your account portal or reply to this email and we''ll send you a prepaid return label. Once we receive the item, your refund will be processed within 5–7 business days.',
        'llama-3.3-70b-versatile',
        now() - interval '11 hours',
        (SELECT id FROM admin)
    ),
    -- 5. Taylor Brooks — DRAFTED
    (
        'b5555555-5555-5555-5555-555555555555',
        'a5555555-5555-5555-5555-555555555555',
        'Hello Taylor, thank you for considering Maple & Co. for your hospitality project! We do offer a trade discount program for design professionals ordering multiple pieces. For an order of 12 artisan tables, we can offer a 15% wholesale discount off the retail price. We''d love to discuss the specific models you''re interested in and provide you with a formal quote. Please let us know a convenient time to connect, or feel free to share the product links and we''ll send pricing right over.',
        'llama-3.3-70b-versatile',
        now() - interval '14 hours',
        (SELECT id FROM admin)
    );

-- Replies for APPROVED inquiries
WITH admin AS (SELECT id FROM users WHERE email = 'admin@frontdesk.dev')
INSERT INTO replies (id, inquiry_id, draft_text, ai_model_used, generated_at, last_edited_by_user_id, approved_at, approved_by_user_id)
VALUES
    -- 6. Avery Thompson — APPROVED
    (
        'b6666666-6666-6666-6666-666666666666',
        'a6666666-6666-6666-6666-666666666666',
        'Hi Avery! We definitely understand the concern about rural delivery timelines. Standard shipping to rural addresses typically takes 5–8 business days depending on the carrier''s route schedules. If you''re on a tight timeline, we also offer expedited shipping options that can bring that down to 2–3 business days. If you let us know your ZIP code, we can give you a more accurate estimate before you place your order.',
        'llama-3.3-70b-versatile',
        now() - interval '19 hours',
        (SELECT id FROM admin),
        now() - interval '30 minutes',
        (SELECT id FROM admin)
    ),
    -- 7. Quinn Rivera — APPROVED
    (
        'b7777777-7777-7777-7777-777777777777',
        'a7777777-7777-7777-7777-777777777777',
        'Hi Quinn! We''re glad you''re interested in the walnut side table — it''s a customer favorite! We expect it to be back in stock within the next two weeks. If you''d like, we can sign you up for a restock notification so you''ll receive an email the moment it''s available again. Just let us know and we''ll add you to the list!',
        'llama-3.3-70b-versatile',
        now() - interval '25 hours',
        (SELECT id FROM admin),
        now() - interval '1 hour',
        (SELECT id FROM admin)
    );

-- Reply for SENT inquiry
WITH admin AS (SELECT id FROM users WHERE email = 'admin@frontdesk.dev')
INSERT INTO replies (id, inquiry_id, draft_text, ai_model_used, generated_at, last_edited_by_user_id, approved_at, approved_by_user_id, sent_at)
VALUES
    -- 8. Sam Nguyen — SENT
    (
        'b8888888-8888-8888-8888-888888888888',
        'a8888888-8888-8888-8888-888888888888',
        'Hi Sam! Thanks for reaching out. Your order #1082 is currently being prepared and is on track for shipment. You should receive your tracking information via email within 24 hours. Once the carrier scans the package, you''ll be able to follow its progress directly through the tracking link. If you don''t see the email by tomorrow, feel free to check your spam folder or reach back out to us!',
        'llama-3.3-70b-versatile',
        now() - interval '31 hours',
        (SELECT id FROM admin),
        now() - interval '3 hours',
        (SELECT id FROM admin),
        now() - interval '2 hours'
    );

-- Reply for FAILED inquiry (null draft_text)
WITH admin AS (SELECT id FROM users WHERE email = 'admin@frontdesk.dev')
INSERT INTO replies (id, inquiry_id, ai_model_used, generated_at)
VALUES
    (
        'bccccccc-cccc-cccc-cccc-cccccccccccc',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'llama-3.3-70b-versatile',
        now() - interval '69 hours'
    );

-- Activity log for FAILED generation
WITH admin AS (SELECT id FROM users WHERE email = 'admin@frontdesk.dev')
INSERT INTO activity_log (id, event_type, related_entity_type, related_entity_id, actor_user_id, timestamp, detail_text)
VALUES
    (
        'dccccccc-cccc-cccc-cccc-cccccccccccc',
        'GENERATION_FAILED',
        'inquiry',
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        (SELECT id FROM admin),
        now() - interval '69 hours',
        'Groq API request timed out after 15 seconds. Please retry.'
    );
