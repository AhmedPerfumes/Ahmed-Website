"use client";
import { useState } from "react";
import { Box, Container, Typography, Collapse } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useLocale } from "next-intl";

// ─── Helper: render a paragraph string with linked phrases ───────────────────
// `linksMap` is an object like: { "phrase to link": "https://..." }
const renderParagraphWithLinks = (text, linksMap) => {
    if (!linksMap || Object.keys(linksMap).length === 0) return text;

    // Build a regex that matches any of the phrases (longest first to avoid
    // partial matches when one phrase is a substring of another)
    const phrases = Object.keys(linksMap).sort((a, b) => b.length - a.length);
    const escaped = phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "g");

    const parts = text.split(regex);

    return parts.map((part, i) => {
        const href = linksMap[part];
        if (href) {
            return (
                <a
                    key={i}
                    href={href}
                    style={{
                        color: "#BF953F",
                        textDecoration: "underline",
                        textUnderlineOffset: "2px",
                    }}
                    // Keep SEO value – use rel="noopener" only for external links
                    rel={href.startsWith("http") ? "noopener" : undefined}
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};

const RamadanSEOContent = () => {
    const [expanded, setExpanded] = useState(false);
    const locale = useLocale();
    const isRtl = locale === "ar";

    const content = {
        en: {
            title: "From Premium Oriental Fragrances to Luxury Perfume Gift Sets – What Eid Truly Means in the UAE",
            fullText: `Eid in the UAE is a season of reflection, generosity, and heartfelt Eid gifting. It is not about price tags. It is about meaning. Families gather, homes glow with warmth, and fragrances fill the air. This is where a carefully chosen gift set for Eid becomes more than a present. It becomes a gesture of respect. A well curated Eid gift box carries emotion, tradition, and elegance in one experience. Fragrance plays a deep role in the culture. A thoughtful Eid gift ideas list often begins with perfume because scent creates memory. A premium Eid gift set with rich oils and fine blends brings lasting joy. When people look for a signature Eid perfume, they seek depth, warmth, and identity. This is why Eid scents built on oud, amber, and florals remain timeless in every oriental floral perfume tradition. Ahmed Al Maghribi Perfumes captures this heritage through best oriental perfumes that blend craft and culture. These refined oriental fragrances speak of luxury without excess. They turn simple Eid gifts into personal treasures. A fragrance filled Eid hamper or elegant Eid hampers collection becomes a story the receiver remembers long after Eid.

            Eid Gifting Culture In UAE

            In the Emirates, Eid gifting is a language of care. People visit loved ones carrying sweets, dates, and perfume. A beautifully arranged gift set for Eid shows gratitude and connection. The presentation matters as much as the product. That is why a premium Eid gift box with layered packaging elevates the moment.

            Families plan meaningful Eid gift ideas ahead of time. A curated Eid gift set filled with fragrance is a popular choice because scent suits all ages. A luxurious Eid perfume reflects respect for tradition. Rich Eid scents from oud and rose echo heritage. These notes define every oriental floral perfume and remain among the best oriental perfumes loved in the region. Such oriental fragrances transform ordinary Eid gifts into refined gestures. When combined in a luxury Eid hamper, the effect is powerful. Premium Eid hampers filled with scent and care items make ideal offerings. Many choose a complete Eid gift basket or elegant Eid gift hampers for family visits, while designer Eid gift boxes add sophistication.

            Eid Gift Sets That Strengthen Bonds

            Relationships grow stronger through thoughtful Eid gifting. A well selected gift set for Eid says you value the bond. A curated Eid gift box with signature scents feels personal. People often search for unique Eid gift ideas that go beyond sweets. A luxury Eid gift set filled with perfume answers that need perfectly. Gifting a refined Eid perfume shows attention to detail. Deep Eid scents create calm and reflection. A balanced oriental floral perfume offers elegance without being heavy. These profiles define the best oriental perfumes in the Gulf. Premium oriental fragrances linger and create memory, turning simple Eid gifts into meaningful keepsakes.

            When arranged in a premium Eid hamper, the impact multiplies. Elegant Eid hampers filled with fragrance oils and sprays feel generous. A curated Eid gift basket or stylish Eid gift hampers set makes visits memorable. Signature Eid gift boxes and thoughtful Eid corporate gifts also strengthen professional ties.

            Can’t Decide? Let The Fragrance Experts Guide You

            Choosing from many Eid gifting options can feel overwhelming. Experts help you select the right gift set for Eid based on personality. A tailored Eid gift box ensures balance. If unsure, start with classic Eid gift ideas built around fragrance.

            A versatile Eid gift set with a signature Eid perfume works for most tastes. Soft Eid scents in a refined oriental floral perfume suit daily wear. For bold preferences, explore the best oriental perfumes rich in oud and amber. These iconic oriental fragrances define premium Eid gifts.

            A well curated Eid hamper simplifies choice. Luxury Eid hampers combine oils, sprays, and bakhoor. You can also opt for a Eid gift basket, elegant Eid gift hampers, or statement Eid gift boxes. For offices, tailored Eid corporate gifts leave a lasting impression.

            Here we have top 5 giftsets you can gift your loved ones for Eid.

            Top 5 Luxury Eid Gift Sets You Can Share With Loved Ones

            Eid is a time of generosity, and thoughtful Eid gifting becomes a way to express care. During family visits, festive gatherings, and Eid celebrations, a refined gift set for Eid creates lasting memories. A premium Eid gift box filled with fragrance reflects culture and respect. Many people search for meaningful Eid gift ideas that feel elegant yet personal.

            A luxury Eid gift set built around fragrance never fails. Scent connects emotion, which is why a signature Eid perfume remains a classic choice. Rich Eid scents inspired by oud and florals suit every generation. These profiles define the beauty of an oriental floral perfume and explain why they remain among the best oriental perfumes in the region. Such oriental fragrances elevate simple Eid gifts into memorable treasures, especially when arranged in a premium Eid hamper or stylish Eid gift boxes.

            Qarnain Gift Set The Qarnain set is designed for meaningful Eid gifting moments. This elegant gift set for Eid captures the joy of Eid and togetherness. Its premium presentation makes it a standout Eid gift box for family gatherings and festive visits.

            As one of the refined Eid gift ideas, this luxurious Eid gift set includes a signature Eid perfume crafted for the season. The warm Eid scents reflect tradition and comfort. Inspired by classic oriental floral perfume heritage, it stands proudly among the best oriental perfumes. These timeless oriental fragrances transform thoughtful Eid gifts into keepsakes. Whether added to a Eid hamper or given in elegant Eid gift boxes, it makes a strong impression.

            Shauque Al Shuyookh Gift Set

            For those who value tradition, this set defines premium Eid gifting. It is more than a gift set for Eid. It is an experience. The luxurious Eid gift box includes Bin Shaikh Perfume, Oud Classic Perfume, and Dehn Al Oudh Mubakhar, blending iconic Eid scents. Among popular Eid gift ideas, Shauque Al Shuyookh Eid gift set stands out for its spiritual and cultural touch. Alongside a refined Eid perfume, it includes a Mabkhar, Prayer Mat, and Masbaha. The fragrance profile leans into rich oriental floral perfume notes and belongs to the best oriental perfumes category. Such deep oriental fragrances elevate premium Eid gifts. It also works beautifully in Eid corporate gifts and high-end Eid hampers.

            The Dakhoon Collection

            Traditional fragrance lovers appreciate this refined Eid gifting option. As a unique gift set for Eid, this aromatic Eid gift box focuses on ambiance. The Dakhoon Collection features Oud Ma’attar Majalis, Mariya Oud Mubakhar, Bakhoor Ahmed tabs, and Khashab Al Oud.

            These selections represent classic Eid gift ideas centered around atmosphere. Though not a typical Eid gift set, the rich smoke pairs perfectly with a Eid perfume. Deep Eid scents from oud wood align with oriental floral perfume traditions. They remain part of the best oriental perfumes world of luxury. Such bold oriental fragrances make memorable Eid gifts, ideal inside a Eid hamper or elegant Eid gift hampers.

            Ihdaa Khaas Gift Set Ihdaa Khaas defines sophisticated Eid gifting. This premium gift set for Eid arrives in a beautifully arranged Eid gift box that speaks of elegance. It is one of the most refined Eid gift ideas for luxury lovers.

            The Eid gift set includes Oud Lavender, Couture Noir, and Oud Arian Super. Each Eid perfume brings layered Eid scents. The presence of an air freshener adds lifestyle value. Inspired by oriental floral perfume heritage, this set belongs among the best oriental perfumes. These balanced oriental fragrances elevate meaningful Eid gifts and shine in upscale Eid gift hampers or exclusive Eid corporate gifts.

            Antee Gift Set 05

            This elegant option supports graceful Eid gifting. A well crafted gift set for Eid, it arrives in a refined Eid gift box suited for gatherings. As one of the versatile Eid gift ideas, it balances beauty and scent. The Antee gift set includes Rose Noir, Bidun Esam, Rose Noir Hair Mist, and Bakhoor Antee. Each Eid perfume offers smooth Eid scents that feel modern yet rooted in oriental floral perfume character. These blends align with the best oriental perfumes tradition. Rich oriental fragrances transform everyday Eid gifts into luxury gestures. Perfect for a Eid hamper, stylish Eid gift baskets, or premium Eid gift boxes, this set delights every recipient.

            Luxury Perfume Gift Sets For Her

            Elegant Eid gifting for women focuses on grace. A delicate gift set for Eid with florals is ideal. A refined Eid gift box in soft tones adds charm. Popular Eid gift ideas include rose and vanilla blends.

            A feminine Eid gift set with a signature Eid perfume offers beauty and identity. Light Eid scents in an oriental floral perfume feel timeless. These remain among the best oriental perfumes for women. Fine oriental fragrances elevate personal Eid gifts.

            A curated Eid hamper with perfume and oils feels indulgent. Stylish Eid hampers, a luxury Eid gift basket, or elegant Eid gift hampers complete the experience. Premium Eid gift boxes and thoughtful Eid gifts for friends make the moment special.

            Best Perfume Gift Sets for Him

            Masculine Eid gifting leans toward depth. A bold gift set for Eid with oud works well. A structured Eid gift box in dark tones feels premium. Strong Eid gift ideas focus on wood and spice.

            A rich Eid gift set built around a signature Eid perfume feels powerful. Deep Eid scents in an oriental floral perfume blend strength with elegance. These profiles define the best oriental perfumes for men. Classic oriental fragrances turn simple Eid gifts into statements.

            A premium Eid hamper with concentrated oils stands out. Luxury Eid hampers, a curated Eid gift basket, or refined Eid gift hampers work perfectly. Signature Eid gift boxes and thoughtful Eid gifts for friends add personal value.

            Eid Gifts For Friends and Family

            Meaningful Eid gifting strengthens community. A warm gift set for Eid fits every home. A welcoming Eid gift box makes visits memorable. Popular Eid gift ideas focus on fragrance and care.

            A versatile Eid gift set with a balanced Eid perfume suits all ages. Soft Eid scents from an oriental floral perfume feel comforting. These are among the best oriental perfumes for shared gifting. Elegant oriental fragrances turn thoughtful Eid gifts into cherished items.

            A generous Eid hamper filled with scent delights families. Premium Eid hampers, a festive Eid gift basket, or classic Eid gift hampers bring smiles. Designer Eid gift boxes and stylish Eid box options complete the experience.

            Best Eid Corporate Gifts

            Professional Eid gifting builds respect. A luxury gift set for Eid shows appreciation. A refined Eid gift box with brand elegance leaves impact. Corporate Eid gift ideas focus on quality.

            A premium Eid gift set with a signature Eid perfume feels prestigious. Sophisticated Eid scents in an oriental floral perfume convey class. These belong to the best oriental perfumes for executives. Elite oriental fragrances upgrade standard Eid gifts.

            A branded Eid hamper adds value. Curated Eid hampers, a professional Eid gift basket, or custom Eid gift hampers strengthen relationships. Exclusive Eid gift boxes and premium Eid corporate gifts position your brand with distinction.

            Frequently Asked Questions


            1. What is the best gift for Eid in UAE?

            The best choice for Eid gifting in the UAE is a premium Eid gift set that includes perfume, oils, or bakhoor. Fragrance is meaningful, useful, and culturally appreciated during Eid visits. A well-presented Eid gift box feels thoughtful and suits both family and corporate exchanges. Many people prefer a Eid perfume set because scent plays a strong role in hospitality and personal care during the season.

            2. What fragrance do Emiratis wear during Eid?

            During Eid, Emiratis lean toward elegant Eid scents that feel smooth rather than overpowering. Traditional oriental fragrances with oud, amber, and musk are popular, often softened with florals. An oriental floral perfume works well for gatherings, while deeper blends are worn in evenings. Many consider these among the best oriental perfumes because they balance presence and respect for close settings.

            3. Which perfume brand is famous in the UAE?

            Many local Arabic perfume brands have become famous in the UAE in recent years. Ahmed Al Maghribi is one of them. The brand has been in the market for over two decades and has become famous and a go to options for premium and luxury fragrances in the UAE.

            The UAE fragrance market values brands that specialize in authentic oriental fragrances and long-lasting blends. Customers look for names known for quality oils, rich oud bases, and refined compositions. Brands offering curated Eid gift ideas and luxury Eid gift set options often stand out, especially during the festive season when gifting demand rises.

            4. What is the best corporate gift for Eid?

            For businesses, fragrance-based Eid gifting is highly effective. A premium Eid gift box with perfumes or bakhoor feels respectful and professional. Companies often choose a gift set for Eid because it is elegant, easy to present, and suitable for different recipients. These Eid gift ideas work well since scent connects with hospitality and tradition.

            5. What is the most popular scent in Dubai?

            Dubai is known for love of oriental fragrances that combine oud, amber, and musk. Many shoppers also choose an oriental floral perfume for daily elegance. These blends are often described as the best oriental perfumes because they last long and suit both day and evening wear. During the season, Eid scents with smooth warmth and depth become especially popular.`,
            links: {
                "Eid gifting": "https://ae.ahmedalmaghribi.com/en",
                "gift set for Eid": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "Eid gift ideas": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "best oriental perfumes": "https://ae.ahmedalmaghribi.com/en/product-category/perfumes/oriental-fragrance",
                "Eid gift box": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "oriental fragrances": "https://ae.ahmedalmaghribi.com/en/product-category/perfumes/oriental-fragrance",
                "Eid scent": "https://ae.ahmedalmaghribi.com/en/product-category/concentrated-parfum",
                "Eid gift basket": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "Eid corporate gifts": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "The Qarnain set": "https://ae.ahmedalmaghribi.com/en/shop/gift-sets/gift-sets/qarnain",
                "Shauque Al Shuyookh": "https://ae.ahmedalmaghribi.com/en/shop/gift-sets/gift-sets/shauque-al-shuyookh",
                "The Dakhoon Collection": "https://ae.ahmedalmaghribi.com/en/shop/gift-sets/gift-sets/the-dukhoon-collection",
                "Ihdaa Khaas": "https://ae.ahmedalmaghribi.com/en/shop/gift-sets/gift-sets/ihdaa-khaas",
                "The Antee gift set": "https://ae.ahmedalmaghribi.com/en/shop/gift-sets/gift-sets/antee-gift-set-05",
                "Eid gifts for friend": "https://ae.ahmedalmaghribi.com/en/product-category/gift-sets",
                "premium Eid corporate gift": "https://ae.ahmedalmaghribi.com/en/shop",
            }
        },
        ar: {
            title: "محتوى صفحة هدايا العيد – من العطور الشرقية المميزة إلى مجموعات الهدايا الفاخرة ماذا يعني العيد فعلاً في الإمارات",
            fullText: `العيد في الإمارات موسم للتأمل، والكرم، وهدايا العيد من القلب. الموضوع مو بس في السعر، الموضوع في المعنى. العائلة تتجمع، البيوت تتزين بالدفء، والروائح تعطر الأجواء. هنا يصير اختيار مجموعة هدايا العيد بعناية أكثر من مجرد هدية، يصير تعبير عن احترام.

            صندوق هدايا العيد المختار بعناية يحمل العاطفة، والتقاليد، والأناقة في تجربة واحدة. العطور لها دور عميق في الثقافة. قائمة أفكار هدايا العيد غالباً تبدأ بالعطور لأن الريحة تخلق ذكرى. مجموعة هدايا العيد فاخرة مع زيوت غنية وخلطات راقية تجيب فرحة دائمة.

            لما الناس يبحثون عن عطر العيد المميز، يدورون على العمق، الدفء، والهوية. عشان كذا روائح العيد المبنية على العود، العنبر، والأزهار تبقى خالدة في كل تقاليد العطور الشرقية الزهرية. عطور أحمد المغربي تعكس هذا التراث من خلال أفضل العطور الشرقية اللي تمزج الحرفة والثقافة. هالعطور الراقية تحكي عن الفخامة بدون مبالغة، وتحول هدايا العيد العادية لكنوز شخصية. سلة هدايا العيد المعطرة بالعطور أو مجموعة سلال العيد الأنيقة تصير قصة يتذكرها المتلقي بعد العيد بفترة طويلة.

            ---

            ثقافة هدايا العيد في الإمارات في الإمارات، هدايا العيد لغة للعناية. الناس يزورون الأحباب ومعاهم حلويات، تمر، وعطور. مجموعة هدايا العيد مرتبة بشكل جميل تعكس الامتنان والترابط. طريقة تقديم الهدية بنفس أهمية المنتج، عشان كذا صندوق هدايا العيد فاخر مع تغليف متعدد الطبقات يرفع قيمة اللحظة.

            العائلات تخطط لأفكار هدايا العيد مسبقاً. مجموعة هدايا مختارة بعطر خيار شعبي لأنها تناسب كل الأعمار. عطر العيد الفاخر يعكس احترام للتقاليد. الروائح الغنية من العود والورد تعكس التراث. هذي النفحات تحدد كل عطر شرقي زهري وتظل من أفضل العطور الشرقية المحبوبة في المنطقة. هذي العطور الشرقية تحول هدايا العيد العادية إلى لمسات راقية. لما تضاف في سلة العيد فاخرة، التأثير يكون قوي. سلال العيد الفاخرة المليئة بالعطور ومواد العناية مثالية كعروض هدايا. كثير يختارون سلة هدايا العيد كاملة أو مجموعات سلال العيد الأنيقة للزيارات العائلية، بينما صناديق الهدايا المصممة تضيف لمسة أناقة.

            ---

            مجموعات هدايا العيد اللي تقوي الروابط العلاقات تصير أقوى من خلال هدايا العيد المدروسة. مجموعة هدايا العيد مختارة بعناية تقول إنك تقدّر العلاقة. صندوق هدايا العيد مع عطور مميزة يحسسك بالشخصية. كثير يبحثون عن أفكار هدايا العيد فريدة تتجاوز الحلويات. مجموعة هدايا فاخرة مليانة عطور تجاوب هالحاجة بشكل مثالي. إهداء عطر العيد راقي يظهر اهتمامك بالتفاصيل. الروائح العميقة للعيد تخلق هدوء وتأمل. عطر شرقي زهري متوازن يعطي أناقة بدون ثقل. هذي الروائح تحدد أفضل العطور الشرقية في الخليج. العطور الشرقية الفاخرة تدوم وتخلق ذكرى، تحول الهدايا البسيطة إلى تذكارات معنوية. لما تترتب في سلة هدايا العيد فاخرة، التأثير يتضاعف. سلال العيد الأنيقة المليئة بزيوت وعطور تحسسك بالكرم. صندوق هدايا العيد مختار بعناية أو سلال أنيقة تجعل الزيارات لا تُنسى. صناديق هدايا العيد المميزة وهدايا العيد للشركات تعزز الروابط المهنية أيضاً.

            ---

            ما تعرف شنو تختار؟ خلي خبراء العطور يرشدونك الاختيار من بين خيارات هدايا العيد الكثيرة ممكن يكون مربك. الخبراء يساعدونك تختار مجموعة الهدايا المناسبة لشخصية

            المتلقي. صندوق هدايا العيد مصمم خصيصاً يضمن التوازن. إذا كنت محتار، ابدأ بأفكار هدايا العيد كلاسيكية مبنية على العطور.

            مجموعة هدايا العيد متعددة الاستخدامات مع عطر العيد المميز تناسب أغلب الأذواق. روائح العيد الناعمة في عطر شرقي زهري راقي مناسبة للارتداء اليومي. لمن يحبون الروائح القوية، استكشف أفضل العطور الشرقية الغنية بالعود والعنبر. هذي العطور الشرقية الأيقونية تحدد الهدايا الفاخرة في العيد.

            صندوق هدايا العيد المختار بعناية يبسط الاختيار. سلال العيد الفاخرة تجمع الزيوت، العطور، والبخور. تقدر تختار أيضاً سلة هدايا العيد، سلال العيد الأنيقة، أو صناديق هدايا العيد الملفتة. للمكاتب، هدايا العيد المخصصة للشركات تترك انطباع يدوم.

            ---

            أفضل 5 مجموعات هدايا فاخرة في العيد ممكن تشاركها مع الأحباب

            العيد وقت الكرم، وهدايا العيد المدروسة تصير طريقة للتعبير عن الاهتمام. خلال الزيارات العائلية، الإفطار، واحتفالات العيد، مجموعة هدايا العيد الفاخرة تخلق ذكريات دائمة. صندوق هدايا العيد مليان بالعطور يعكس الثقافة والاحترام. كثير يبحثون عن أفكار هدايا العيد ذات معنى وتشعر بالأناقة والشخصية. مجموعة هدايا فاخرة مبنية على العطور دايمًا خيار مضمون.

            ---

            مجموعة قَرْنَيْن صممت مجموعة قَرْنَيْن للحظات هدايا العيد ذات معنى. هالصندوق الراقـي يعكس فرحة العيد والتجمعات. طريقة تقديمه الفاخرة تخليه بارز كصندوق هدايا العيد للزيارات العائلية والمناسبات. من أفكار هدايا العيد الراقية، تشمل مجموعة عطراً عيدية مميزة صممت للموسم. الروائح الدافئة تعكس التقليد والراحة. مستوحاة من التراث الشرقي الزهري، تصنف ضمن أفضل العطور الشرقية. هذي العطور تحول الهدايا المدروسة لتذكارات. سواء أضيفت لسلة العيد أو أعطيت في صناديق هدايا أنيقة، تترك أثر قوي.

            ---

            مجموعة شوق الشيوخ للي يقدّرون التقليد، هالمجموعة تعرف هدايا العيد الفاخرة. أكثر من مجرد صندوق هدايا العيد، هي تجربة. صندوق العيد الفاخر يشمل عطر بن شيخ، عطر العود الكلاسيكي، ودهان العود مبخر، يمزجون روائح العيد الأيقونية. ضمن أفكار هدايا العيد الشعبية، مجموعة شوق الشيوخ تبرز بلمسة روحية وثقافية. إلى جانب العطر، تشمل مبخرة، سجادة صلاة، ومسبحة. نغمة العطر تميل للروائح الشرقية الزهرية الغنية وتندرج ضمن أفضل العطور الشرقية. هذي الروائح العميقة ترفع مستوى الهدايا الفاخرة، وتصلح أيضاً كهدايا العيد للشركات وسلال العيد الراقية.

            ---

            مجموعة الدخون محبو العطور التقليدية يقدّرون هالخيار الراقي. كهدية العيد فريدة، يركز صندوق الدخون على خلق الجو. يشمل عود معطر مجالس، ماريّا عود مبخر، بخور أحمد تاب، وخشب العود. هذي الاختيارات تمثل أفكار هدايا العيد الكلاسيكية المرتكزة على الأجواء. رغم إنها مو صندوق هدايا العيد نموذجي، الدخان الغني ينسجم مع عطرك العيدي. الروائح العميقة من خشب العود تتماشى مع تقاليد العطر الشرقي الزهري، وتظل ضمن عالم أفضل العطور الشرقية الفاخرة. هذي الروائح الشرقية الجريئة تصنع هدايا العيد لا تُنسى، مثالية داخل سلة العيد أو سلال العيد الأنيقة.

            ---

            مجموعة إهداء خاص تعرف مجموعة إهداء خاص على هدايا العيد الراقية. صندوق هدايا العيد الفاخر يوصل بشكل مرتب ويعكس الأناقة. من أفكار هدايا العيد الراقية لمحبي الفخامة. تشمل المجموعة عود لافندر، كوتور نوير، وعود أريان سوبر. كل عطر يضيف طبقات من روائح العيد. وجود معطر جو يضيف قيمة للحياة اليومية. مستوحاة من التراث الشرقي الزهري، تنتمي ضمن أفضل العطور الشرقية. العطور المتوازنة ترفع قيمة هدايا العيد وتلمع في سلال العيد الراقية أو هدايا العيد للشركات الحصرية.

            ---

            مجموعة هدايا أنتي مجموعة أنتي تشمل روز نوير، بيدون عصام، رذاذ شعر روز نوير، وبخور أنتي. كل عطر العيد يقدم روائح سلسة تناسب العصر وفي نفس الوقت متجذرة في طابع العطور الشرقية الزهرية. هذي الخلطات تتماشى مع تقاليد أفضل العطور الشرقية. العطور الشرقية الغنية تحول هدايا العيد اليومية إلى لمسات فاخرة. مثالية لسلة العيد، سلال هدايا العيد الأنيقة، أو صناديق هدايا العيد الفاخرة، وتفرح كل من يستلمها---

            مجموعات هدايا عطور فاخرة للنساء هدايا العيد للنساء تركز على الرقة. صندوق هدايا العيد ناعم مليان أزهار مثالي. صندوق هدايا العيد مرتب بألوان هادئة يضيف سحر. أفكار هدايا العيد الشعبية تشمل مزيج الورد والفانيليا. مجموعة نسائية مع عطر العيد المميز تمنح الجمال والهوية. الروائح الخفيفة في عطر شرقي زهري تحس بالخلود. تظل ضمن أفضل العطور الشرقية للنساء. العطور الراقية ترفع قيمة هدايا العيد الشخصية. سلة العيد المختارة بعناية مع العطر والزيوت تحس بالترف. سلال العيد الأنيقة، سلة هدايا العيد الفاخرة، أو صناديق هدايا العيد تكمل التجربة.

            ---

            أفضل مجموعات هدايا عطور للرجال هدايا العيد الرجالية تميل للعمق. صندوق هدايا العيد قوي مع العود مناسب. صندوق هدايا العيد داكن يعطي إحساس بالفخامة. أفكار هدايا العيد الغنية بالخشب والتوابل مميزة. مجموعة فاخرة مبنية على عطر العيد تعطي قوة. الروائح العميقة في عطر شرقي زهري تمزج القوة مع الأناقة. هذي النغمات تحدد أفضل العطور الشرقية للرجال. العطور الكلاسيكية تحول الهدايا البسيطة إلى بيانات. سلة العيد الفاخرة مع الزيوت المركزة تبرز. سلال العيد الفاخرة، سلة العيد المختارة، أو سلال العيد الراقية تعمل بشكل مثالي. صناديق هدايا العيد المميزة وهدايا العيد للأصدقاء تضيف قيمة شخصية.

            ---

            هدايا العيد للأصدقاء والعائلة هدايا العيد ذات معنى تقوي المجتمع. صندوق هدايا دافئ يناسب كل بيت. صندوق هدايا العيد مرحب يجعل الزيارات لا تُنسى. أفكار هدايا العيد الشعبية تركز على العطور والعناية. مجموعة هدايا العيد متعددة الاستخدامات مع عطر متوازن تناسب كل الأعمار. الروائح الناعمة من عطر شرقي زهري تحس بالراحة. هذي ضمن أفضل العطور الشرقية للهدايا المشتركة. العطور الشرقية الأنيقة تحول الهدايا المدروسة إلى مقتنيات ثمينة. سلة العيد الكريمة المليئة بالعطور تسعد العائلات. سلال العيد الفاخرة، سلة هدايا العيد الاحتفالية، أو سلال العيد الكلاسيكية تجيب الابتسامات. صناديق هدايا العيد المصممة والمختارة تكمل التجربة.

            ---

            أفضل هدايا العيد للشركات هدايا العيد المهنية تبني الاحترام. صندوق هدايا العيد فاخر يظهر التقدير. صندوق هدايا العيد راقي مع علامة تجارية يترك أثر. أفكار هدايا العيد للشركات تركز على الجودة. مجموعة هدايا العيد فاخرة مع عطر العيد المميز تحس بالهيبة. الروائح الراقية في عطر شرقي زهري تعكس الرقي. هذي ضمن أفضل العطور الشرقية للمديرين. العطور الشرقية الراقية ترفع مستوى الهدايا العادية. سلة العيد بعلامة تجارية تضيف قيمة. سلال العيد المختارة، سلة هدايا العيد المهنية، أو سلال العيد المخصصة تعزز العلاقات. صناديق هدايا العيد الحصرية وهدايا العيد الفاخرة للشركات تميز علامتك.

            ---

            الأسئلة المتكررة

            1. ما هو أفضل هدية للعيد في الإمارات؟ أفضل خيار لهدايا العيد في الإمارات هو صندوق هدايا العيد فاخر يشمل عطور، زيوت، أو بخور. العطر له معنى، مفيد، ومقدر ثقافياً أثناء زيارات العيد. صندوق هدايا العيد مرتب يعطي شعور بالاهتمام ويناسب التبادل العائلي والشركات. كثير يفضلون مجموعة عطور العيد لأن الريحة جزء مهم من الضيافة والعناية الشخصية خلال الموسم.

            2. أي عطر يرتديه الإماراتيون في العيد؟ خلال العيد، الإماراتيون يفضلون روائح العيد الأنيقة والناعمة بدون قوة زائدة. العطور الشرقية التقليدية بالعود، العنبر، والمسك شائعة، وغالباً مع لمسة من الزهور. عطر شرقي زهري مناسب للتجمعات، والمزيج العميق يستخدم في المساء. كثير يعتبرونها من أفضل العطور الشرقية لأنها توازن بين الحضور والاحترام للأجواء المقربة.

            3. أي ماركة عطور مشهورة في الإمارات؟ الكثير من العلامات العربية المحلية صارت مشهورة في الإمارات أحمد المغربي من بينهم. العلامة موجودة أكثر من عشرين سنة وصارت خيار رئيسي للعطور الفاخرة في الإمارات. سوق العطور في الإمارات يقدّر العلامات المتخصصة بالعطور الشرقية الأصيلة والخليط الطويل الأمد. العملاء يبحثون عن أسماء معروفة بالزيوت ذات الجودة، قواعد العود الغنية، وتركيبات راقية. العلامات اللي تقدم أفكار هدايا العيد ومجموعات هدايا العيد الفاخرة غالباً تتميز، خصوصاً موسم الهدايا.

            4. ما أفضل هدية للشركات في العيد؟ للشركات، هدايا العيد المعتمدة على العطور فعّالة جداً. صندوق هدايا العيد فاخر مع عطور أو بخور يعطي شعور بالاحترام والاحترافية. الشركات غالباً تختار مجموعة هدايا العيد لأنها أنيقة وسهلة التقديم وتناسب مختلف المستلمين. هذي أفكار هدايا العيد ناجحة لأن العطر يرتبط بالضيافة والتقاليد.

            5. ما هي الروائح الأكثر شعبية في دبي؟ دبي معروفة بحب العطور الشرقية اللي تمزج العود، العنبر، والمسك. كثير يشترون أيضاً عطر شرقي زهري للأناقة اليومية. هذي الخلطات غالباً توصف كأفضل العطور الشرقية لأنها تدوم وتناسب النهار والمساء. خلال الموسم، روائح العيد الناعمة والدافئة تصبح شعبية بشكل خاص`,
            // ─── AR Links ─────────────────────────────────────────────────────
            // Add any Arabic phrase that appears in fullText and the URL.
            // Example:
            //   "أحمد المغربي": "https://ahmedalmag.com",
            //   "مجموعة هدايا رمضان": "/ar/ramadan",
            links: {
                // "أحمد المغربي": "https://ahmedalmag.com",
                "هدايا العيد": "https://ae.ahmedalmaghribi.com/ar",
                "مجموعة هدايا العيد": "https://ae.ahmedalmaghribi.com/ar/product-category/gift-sets",
                "أفكار هدايا العيد": "https://ae.ahmedalmaghribi.com/ar/product-category/gift-sets",
                "أفضل العطور الشرقية": "https://ae.ahmedalmaghribi.com/ar/product-category/perfumes/oriental-fragrance",
                "صندوق هدايا العيد": "https://ae.ahmedalmaghribi.com/ar/product-category/gift-sets",
                "العطور الشرقية": "https://ae.ahmedalmaghribi.com/ar/product-category/perfumes/oriental-fragrance",
                "روائح العيد": "https://ae.ahmedalmaghribi.com/ar/product-category/concentrated-parfum",
                "سلة هدايا العيد": "https://ae.ahmedalmaghribi.com/ar/product-category/gift-sets",
                "هدايا العيد للشركات": "https://ae.ahmedalmaghribi.com/ar/product-category/gift-sets",
                "مجموعة قَرْنَيْن": "https://ae.ahmedalmaghribi.com/ar/shop/gift-sets/gift-sets/qarnain",
                "مجموعة شوق الشيوخ": "https://ae.ahmedalmaghribi.com/ar/shop/gift-sets/gift-sets/shauque-al-shuyookh",
                "مجموعة الدخون": "https://ae.ahmedalmaghribi.com/ar/shop/gift-sets/gift-sets/the-dukhoon-collection",
                "مجموعة إهداء خاص": "https://ae.ahmedalmaghribi.com/ar/shop/gift-sets/gift-sets/ihdaa-khaas",
                "مجموعة أنتي": "https://ae.ahmedalmaghribi.com/ar/shop/gift-sets/gift-sets/antee-gift-set-05",
                "هدايا العيد الفاخرة للشركات": "https://ae.ahmedalmaghribi.com/ar/shop",
            }
        }
    };

    const t = content[locale] || content.en;

    return (
        <Box
            component="section"
            dir={isRtl ? "rtl" : "ltr"}
            sx={{
                py: 2,
                background: "transparent",
                borderTop: "1px solid rgba(191, 149, 63, 0.05)"
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: isRtl ? "right" : "left", opacity: 0.6 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: "#5C4A3A",
                            fontSize: "0.7rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            userSelect: "none",
                            "&:hover": { color: "#BF953F" }
                        }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {t.title} {expanded ? <KeyboardArrowUp sx={{ fontSize: "0.9rem" }} /> : <KeyboardArrowDown sx={{ fontSize: "0.9rem" }} />}
                    </Typography>

                    <Collapse in={expanded}>
                        <Box sx={{ mt: 1 }}>
                            {t.fullText.split('\n').map((paragraph, index) => (
                                paragraph.trim() && (
                                    <Typography
                                        key={index}
                                        variant="caption"
                                        component="p"
                                        sx={{
                                            color: "#5C4A3A",
                                            display: "block",
                                            fontSize: "0.65rem",
                                            mb: 1,
                                            lineHeight: 1.4,
                                            textAlign: "justify"
                                        }}
                                    >
                                        {renderParagraphWithLinks(paragraph.trim(), t.links)}
                                    </Typography>
                                )
                            ))}

                        </Box>
                    </Collapse>
                </Box>
            </Container>
        </Box>
    );
};

export default RamadanSEOContent;
