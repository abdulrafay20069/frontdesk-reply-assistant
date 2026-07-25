INSERT INTO business_profile (id, business_name, description, tone, faq_context, updated_at)
VALUES (
    gen_random_uuid(),
    'Maple & Co.',
    'A boutique home goods store that values personal service and quality craftsmanship.',
    'WARM_FRIENDLY',
    'Q: What are your shipping times?
A: Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.

Q: What is your return policy?
A: We accept returns within 30 days of purchase for unused items in original packaging.

Q: What are your store hours?
A: We are open Monday-Saturday 10am-6pm and Sunday 12pm-5pm.',
    now()
);