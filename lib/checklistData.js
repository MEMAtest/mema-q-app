// lib/checklistData.js

const checklistData = [
            {
                id: "section1",
                title: "Section 1: Preliminary Checks & Scope",
                intro: "This section covers initial checks to determine if a communication falls under the financial promotion regulations and to understand its scope. It helps establish the applicability of FCA rules to your specific communication.",
                items: [
                    { id: "1.1", question: "Is the communication an \"invitation or inducement\" to engage in an activity?", ref: "PERG 8.4", explanation: "A financial promotion must invite or encourage someone to engage in a financial activity. Purely factual information, without any persuasive element, might not be considered an invitation or inducement. (PERG 8.4.2 - 8.4.4)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "If not an invitation or inducement, it may not be a financial promotion under s21 FSMA. However, ensure this assessment is robust as the definition is broad. (PERG 8.4)" },
                    { id: "1.2", question: "Is the communication being made \"in the course of business\"? (Consider commercial interest, even if indirect, including for influencers).", ref: "PERG 8.5; FG24/1 (4.16-4.27)", explanation: "The 'in the course of business' test means the communication must have a commercial purpose. This can include activities by influencers if they have a commercial interest, even if not directly paid by the firm being promoted. Personal chats are generally excluded. (PERG 8.5.2, FG24/1 4.18)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "If not made 'in the course of business', the s21 financial promotion restriction may not apply. This typically excludes genuine non-business communications. (PERG 8.5, FG24/1 4.16-4.19)" },
                    { id: "1.3", question: "Does the communication invite or induce someone to \"engage in investment activity\" (relating to a controlled investment) or \"engage in claims management activity\" (relating to a controlled claims management activity)?", ref: "PERG 8.7, 8.7A", explanation: "The promotion must relate to specific 'controlled activities' (like dealing in or advising on investments) or 'controlled investments' (like shares, bonds, some insurance products) or 'controlled claims management activities' as defined by the FCA. (PERG 8.7.1, 8.7A.1)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "If the communication does not relate to engaging in these specified activities with controlled investments/activities, it may not be a financial promotion under s21 FSMA. (PERG 8.7, 8.7A)" },
                    { id: "1.4", question: "If the communication originates outside the UK, is it \"capable of having an effect in the UK\"?", ref: "PERG 8.8; FG24/1 (2.47-2.52)", explanation: "Even if a promotion is made from outside the UK, it falls under UK rules if UK consumers can see it and potentially act on it. (PERG 8.8.1, FG24/1 2.47)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "If it originates outside the UK and is NOT capable of having an effect in the UK (e.g. effectively geo-blocked AND no UK individuals can engage), the s21 restriction may not apply. The threshold for 'capable of having an effect' is broad. (PERG 8.8, FG24/1 2.47)" },
                    {
                        id: "1.5",
                        question: "What is the lawful basis for this financial promotion's communication in the UK?",
                        ref: "s21 FSMA; PERG 8.9; PS23/13",
                        explanation: "A financial promotion can only be lawfully communicated in the UK if: 1) It's made by an FCA authorised firm. 2) Its content is approved by an FCA authorised firm that has specific 'approver permission' (or an exemption to needing this permission applies, e.g., for group company promotions). 3) The communication itself falls under an exemption in the Financial Promotion Order (FPO). (s21 FSMA, PERG 8.9.1, PS23/13 1.2, 1.33)",
                        notes: "",
                        answer: null,
                        type: "dropdown",
                        options: [
                            { value: "", text: "Select basis..." },
                            { value: "authorised_person", text: "Communicated by an FCA authorised person" },
                            { value: "approved", text: "Content approved by an FCA authorised person with approver permission (or exemption)" },
                            { value: "fpo_exempt", text: "Communication is exempt under the Financial Promotion Order (FPO)" },
                            { value: "none", text: "None of the above / Unsure" }
                        ],
                        complianceImplicationIfSelected: {
                            "none": "CRITICAL FAILURE: If none of the lawful bases apply (communicated by an authorised person, approved by an authorised person with approver permission, or exempt under the FPO), communicating the financial promotion is a breach of s21 FSMA, which is a criminal offence. (s21 FSMA, PERG 8.2.1, FG24/1 2.4, PS23/13 1.33)"
                        }
                    },
                    {
                        id: "1.6",
                        question: "What is the type of financial promotion?",
                        ref: "PERG 8.10",
                        explanation: "Financial promotions are categorized as 'real-time' (interactive dialogue like a phone call or personal visit) or 'non-real time' (e.g., websites, emails, social media posts, print). Real-time can be 'solicited' (requested by recipient) or 'unsolicited' (e.g., cold call). This affects which specific rules and exemptions apply. (PERG 8.10.2, 8.10.8)",
                        notes: "",
                        answer: null,
                        type: "dropdown",
                        options: [
                            { value: "", text: "Select type..." },
                            { value: "non_real_time_website", text: "Non-real time (Website / Email / Print)" },
                            { value: "non_real_time_social_post", text: "Non-real time (Social Media Post/Static Ad)" },
                            { value: "non_real_time_social_video", text: "Non-real time (Social Media Video/Story/Reel)" },
                            { value: "real_time_solicited", text: "Real-time solicited (e.g., requested call/meeting)" },
                            { value: "real_time_unsolicited", text: "Real-time unsolicited (e.g., cold call)" },
                            { value: "other_nrt", text: "Other Non-real time (specify in notes)" },
                            { value: "other_rt", text: "Other Real-time (specify in notes)" }
                        ]
                    },
                    {
                        id: "1.7",
                        question: "Who is the primary target audience for this promotion? (Select all that apply)",
                        ref: "COBS (general); FG24/1 (3.4)",
                        explanation: "Understanding the target audience (e.g., Retail Clients, Professional Clients, Eligible Counterparties) is crucial as different rules and levels of protection apply. Promotions to Retail Clients, or mixed audiences including them, generally require the highest standards of clarity and risk warning. (COBS 3, FG24/1 3.4)",
                        notes: "",
                        answer: [], 
                        type: "multiselect",
                        options: [
                            { value: "retail_client", text: "Retail Client" },
                            { value: "professional_client", text: "Professional Client" },
                            { value: "eligible_counterparty", text: "Eligible Counterparty" },
                            { value: "mixed_audience_retail", text: "Mixed Audience (including Retail Clients)" },
                            { value: "specific_hnw_sophisticated", text: "Specific (e.g., High Net Worth / Sophisticated Investors only)"},
                            { value: "other_audience", text: "Other (specify in notes)" }
                        ],
                        complianceImplicationIfSelected: { 
                            "mixed_audience_retail": "If targeting a mixed audience including retail clients, the promotion must meet the higher standards applicable to retail clients, including Consumer Duty obligations. (Consumer Duty, COBS 4, FG24/1 3.4)"
                        }
                    },
                     {
                        id: "1.8",
                        question: "What specific financial product or service is being promoted?",
                        ref: "COBS 4 (various sections); FG24/1 (2.38)",
                        explanation: "The specific product/service (e.g., shares, cryptoassets, pensions, mortgages, BNPL) dictates which detailed FCA rules (from COBS, CONC, MCOB etc.) and specific marketing restrictions apply. Select the closest category.",
                        notes: "",
                        answer: null,
                        type: "dropdown",
                        options: [
                            { value: "", text: "Select product/service type..." },
                            { value: "standard_investment", text: "Standard Investment (e.g., Shares, Bonds, Funds)" },
                            { value: "hri_rmmi", text: "High-Risk Investment (Restricted Mass Market)" },
                            { value: "hri_nmmi", text: "High-Risk Investment (Non-Mass Market)" },
                            { value: "cryptoasset_qualifying", text: "Qualifying Cryptoasset" },
                            { value: "pension_product", text: "Pension Product" },
                            { value: "isa_product", text: "ISA Product" },
                            { value: "insurance_life", text: "Life Insurance / Protection Policy" },
                            { value: "insurance_general", text: "General Insurance Product" },
                            { value: "mortgage_product", text: "Mortgage Product (Regulated)" },
                            { value: "consumer_credit_bnpl", text: "Consumer Credit (BNPL - exempt)" },
                            { value: "consumer_credit_regulated", text: "Consumer Credit (Regulated)" },
                            { value: "claims_management_service", text: "Claims Management Service" },
                            { value: "deposit_account", text: "Deposit Account" },
                            { value: "other_product", text: "Other (specify in notes)" }
                        ]
                    },
                    { id: "1.9", question: "Overall, is the communication clear, fair, and not misleading in its entirety?", ref: "COBS 4.2.1R", explanation: "This is a fundamental FCA requirement. The promotion must be truthful, easy to understand, present a balanced view, and not omit any information that could make it misleading. (COBS 4.2.1R)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "CRITICAL FAILURE: A financial promotion that is not fair, clear, and not misleading breaches a cornerstone of FCA requirements and can lead to significant consumer harm and regulatory action. (COBS 4.2.1R)" },
                    { id: "1.10", question: "Is the promotion \"standalone compliant\" (i.e., compliant when viewed in isolation, even if part of a larger campaign or on character-limited media)?", ref: "FG24/1 (1.3, 2.20-2.23)", explanation: "Each individual piece of a promotion (e.g., a single social media post, one frame of a story) must meet all relevant rules on its own. You cannot rely on information in other parts of the campaign or linked pages to make an individual communication compliant. (FG24/1 2.20-2.21)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Each financial promotion must be compliant on its own. Relying on linked information to achieve compliance for the initial promotion is generally not acceptable and can be misleading. (FG24/1 2.20)" }
                ]
            },
            {
                id: "section2",
                title: "Section 2: Core Principles – Fair, Clear, Not Misleading & The Consumer Duty",
                intro: "This section delves into the fundamental FCA principles that all financial promotions must adhere to, ensuring they are fair, clear, not misleading, and align with the objectives of the Consumer Duty. Focus here is on the quality of information and its impact on consumer understanding and decision-making.",
                items: [
                    { id: "2.1", question: "Does the promotion take into account the nature and characteristics (including potential vulnerabilities) of the client it is aimed at?", ref: "COBS 4.2.1R(3); PRIN 2A.5.8", explanation: "The language, complexity, and information provided must be suitable for the intended audience. For example, promotions for retail clients need to be simpler and provide more explicit warnings than those for professional clients. Consider if any target audience members might be vulnerable. (COBS 4.2.1R(3), PRIN 2A.5.8)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Promotions must be appropriate for their target audience. Failing to consider this can lead to misunderstanding and poor outcomes, breaching COBS and Consumer Duty. (COBS 4.2.1R(3), PRIN 2A.5.8)" },
                    { id: "2.2", question: "Does the promotion avoid disguising, diminishing, or obscuring important items, statements, or warnings (e.g., through small print, complex language, or misleading emphasis)?", ref: "COBS 4.5.2R(4); COBS 4.5A.3UK(e)", explanation: "All significant information, especially risk warnings or key conditions, must be presented clearly and prominently. They should not be hidden in footnotes, made hard to read, or overshadowed by benefits. (COBS 4.5.2R(4))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Key information and warnings must be clear and not hidden or downplayed. Obscuring them is misleading. (COBS 4.5.2R(4))" },
                    { id: "2.3", question: "Is the promotion accurate in all factual claims and representations?", ref: "COBS 4.5.2R(2); COBS 4.5A.3UK(b)", explanation: "All statements of fact, figures, or claims made in the promotion must be true and verifiable. Misleading or unsubstantiated claims are a breach. (COBS 4.5.2R(2))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Inaccurate information is misleading and a breach of rules. All claims must be substantiated. (COBS 4.5.2R(2))" },
                    { id: "2.4", question: "Does the promotion give a fair and prominent indication of any relevant risks whenever it references any potential benefits, ensuring a balanced view?", ref: "COBS 4.5.2R(2); COBS 4.5A.3UK(b)", explanation: "Benefits should not be highlighted without also clearly and prominently stating associated risks. The promotion should give a balanced picture, not just focus on the positives. (COBS 4.5.2R(2))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "A balanced view is required. Omitting or downplaying risks while highlighting benefits is misleading and fails to provide a fair picture. (COBS 4.5.2R(2))" },
                    { id: "2.5", question: "Is the information sufficient for, and presented in a way (e.g., language, layout) that is likely to be understood by, the average member of the target audience?", ref: "COBS 4.5.2R(3); COBS 4.5A.3UK(d); FG24/1; Consumer Duty", explanation: "The promotion should use language and a presentation style that the intended audience can easily understand. Avoid jargon or overly technical terms unless appropriate for a professional audience. (COBS 4.5.2R(3), PRIN 2A.5)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Complex jargon, insufficient detail, or poor presentation can prevent understanding and informed decision-making, breaching COBS and Consumer Duty requirements. (COBS 4.5.2R(3), PRIN 2A.5)" },
                    { id: "2.13", question: "Consumer Duty: Does the promotion actively support retail customer understanding and equip them to make effective, well-informed decisions appropriate to their needs and financial objectives?", ref: "FG24/1 (1.2, 3.1-3.8); PRIN 2A", explanation: "The Consumer Duty requires firms to act to deliver good outcomes for retail customers. Promotions must help customers understand the product/service, its risks, and its suitability for them. (PRIN 2A.5)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Failing to meet the Consumer Duty's consumer understanding outcome is a breach. Promotions must actively support good outcomes and avoid causing foreseeable harm. (PRIN 2A)" },
                    { id: "2.14", question: "Consumer Duty: Has a specific target market been identified for this promotion, and has the communication been appropriately tailored to its characteristics (including any vulnerabilities) and the specific communication channel used?", ref: "FG24/1 (3.3); PRIN 2A", explanation: "Firms must define their target market and ensure promotions are designed and distributed in a way that is appropriate for that market, considering factors like financial literacy, vulnerability, and the nature of the communication channel (e.g., social media limitations). (PRIN 2A.5.4, 2A.5.8, FG24/1 3.3)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "The Consumer Duty requires communications to be designed and distributed appropriately for the defined target market and the channel. Generic promotions to a broad audience may not be suitable for complex products. (PRIN 2A.5.4, 2A.5.8)" },
                    { id: "2.15", question: "Consumer Duty: Does the promotion avoid exploiting customers' behavioural biases (e.g., scarcity, social proof, excessive urgency) and is it communicated in good faith, prioritizing customer interests?", ref: "FG24/1 (3.5); PRIN 2A", explanation: "Promotions should not use psychological tactics to pressure consumers or lead them to make decisions that are not in their best interest. Firms must act honestly, fairly, and professionally. (PRIN 2A.2.1, FG24/1 3.5)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Exploiting biases or acting not in good faith (e.g., 'bombardment' with promotions) is against the Consumer Duty. (PRIN 2A.2.1, FG24/1 3.5)" },
                ]
            },
            {
                id: "section3",
                title: "Section 3: Identification & Information about the Firm",
                intro: "This section focuses on requirements related to clearly identifying the financial promotion as such, and providing necessary information about the firm communicating or approving the promotion.",
                items: [
                    { id: "3.1", question: "Is the financial promotion clearly identifiable as such (e.g., not disguised as editorial content, clearly labelled as 'advertisement' or 'Ad' where appropriate, especially on social media)?", ref: "COBS 4.3.1R; FG24/1", explanation: "It must be obvious to the audience that they are viewing a marketing communication and not, for example, independent news or advice. (COBS 4.3.1R)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Promotions must be clearly identifiable to consumers as marketing material. Disguising promotions can be misleading. (COBS 4.3.1R)" },
                    { id: "3.2", question: "Does the promotion include the name of the firm communicating it (and if different, the name of the firm that approved it, if applicable for retail clients)?", ref: "COBS 4.5.2R(1); COBS 4.5A.3UK(a)", explanation: "The firm responsible for the content of the promotion must be clearly identified. If one firm approves a promotion for another (unauthorised) firm to communicate, both may need to be identified depending on the context and audience. (COBS 4.5.2R(1))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "The firm responsible for the promotion (either communicator or approver) must be clearly named for transparency and accountability. (COBS 4.5.2R(1))" },
                    { id: "3.3", question: "If approved by another firm for a retail client, does the promotion include the date of approval?", ref: "COBS 4.5.2R(1A); FG24/1 (2.30-2.32)", explanation: "For promotions aimed at retail clients that have been approved by an authorised firm, the date of that approval must be stated. This helps consumers understand the timeliness of the information. (COBS 4.5.2R(1A))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "The date of approval is a required disclosure for promotions approved for retail clients, helping to indicate the timeliness of the information. (COBS 4.5.2R(1A))" }
                ]
            },
            {
                id: "section4",
                title: "Section 4: Risk Warnings & Specific Product Disclosures",
                intro: "This section covers specific requirements for risk warnings and disclosures related to various financial products. Prominence, clarity, and accuracy of these disclosures are crucial for consumer protection.",
                items: [
                    { id: "4.1", question: "Are all required risk warnings and product-specific disclosures (e.g., for HRIs, cryptoassets, BNPL) prominent, clear, easily legible, and not obscured or truncated by the medium (especially on social media)?", ref: "FG24/1 (2.24-2.31, 2.41-2.46); COBS 4.12A.36R; COBS 4.12B.24R", explanation: "Risk warnings must be easily noticeable and understandable. On social media, this means they shouldn't be hidden by 'see more' links, be in tiny font, or be difficult to read against the background. For some products, specific wording and placement is mandated. (FG24/1 2.43)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Risk warnings and key disclosures must be prominent and easily visible. Obscuring them, especially prescribed warnings for HRIs, is a serious breach and can lead to significant consumer harm. (FG24/1 2.43, COBS 4.12A.36R)" },
                    { id: "4.2", question: "If promoting Restricted Mass Market Investments (RMMIs) to retail clients: Does the FP include the PRESCRIBED risk warning (from COBS 4 Annex 1R, adapted if necessary per COBS 4.12A.44R)? Are banned incentives avoided? Are direct offer conditions (cooling-off, personalised risk warning, client categorisation, appropriateness assessment) fully met?", ref: "COBS 4.12A; FG24/1 (2.40)", explanation: "RMMIs (e.g., P2P agreements, some crowdfunding, LTAFs, qualifying cryptoassets) have strict rules. This includes specific risk warnings, a ban on certain incentives (like refer-a-friend bonuses for crypto), and for direct offers, a cooling-off period, personalised risk warnings, client categorisation (e.g., restricted, HNW, sophisticated), and an appropriateness assessment. (COBS 4.12A)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "RMMIs have strict marketing restrictions. Failure to include prescribed warnings, offering banned incentives, or not meeting direct offer conditions (like appropriateness) is a serious breach. (COBS 4.12A)" },
                    { id: "4.3", question: "If promoting Non-Mass Market Investments (NMMIs) to retail clients: Is a valid FPO exemption being relied upon (e.g., client is certified HNW/Sophisticated)? Has a preliminary assessment of suitability been conducted by the approver/communicator? Are required risk warnings and specific disclosures (e.g., costs for speculative illiquid securities) present and prominent?", ref: "COBS 4.12B; FG24/1 (2.39)", explanation: "NMMIs (e.g., speculative illiquid securities like mini-bonds, unregulated collective investment schemes) generally cannot be promoted to retail clients. Exemptions are very limited (e.g., for certified High Net Worth or Sophisticated investors) and require strict conditions, including a preliminary suitability assessment by the firm and specific risk warnings. (COBS 4.12B)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "NMMIs cannot be promoted to ordinary retail clients unless specific, narrow exemptions apply and all associated conditions (like suitability assessments and disclosures) are rigorously met. (COBS 4.12B)" }
                ]
            },
            {
                id: "section5",
                title: "Section 5: Communication Channels & Specific Considerations",
                intro: "This section addresses requirements related to different communication channels, with a particular focus on social media and promotions with an overseas element. The chosen channel must be appropriate for the message and audience.",
                items: [
                    { id: "5.1", question: "Social Media: Is each distinct communication (e.g., individual post, story, video, meme) standalone compliant with all relevant FP rules, providing a balanced view of benefits and risks?", ref: "FG24/1 (2.20-2.23, 2.37)", explanation: "Every social media post, story, or video that is a financial promotion must comply with all rules on its own. It cannot rely on information in other posts or linked pages to make it compliant. This includes memes if they act as an inducement. (FG24/1 2.20-2.21, 2.37)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Each social media communication must be compliant in its own right. Fragmented information or over-reliance on 'click-throughs' for essential details is not acceptable. (FG24/1 2.20)" },
                    { id: "5.2", question: "Social Media: If using influencers or affiliate marketers, does the firm have robust systems and controls for their oversight and monitoring? This includes ensuring they understand FP rules, promotions are approved where necessary, and content is not misleading or illegal.", ref: "FG24/1 (1.6, 3.18-3.24, 4.12-4.15)", explanation: "Firms are responsible for promotions made by influencers or affiliates they work with. This means having clear agreements, providing training on compliance, monitoring their posts, and ensuring any FPs they create are approved if the influencer is unauthorised. (FG24/1 3.18-3.22)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Firms are responsible for promotions made by their affiliates/influencers. Inadequate oversight can lead to widespread non-compliant or illegal promotions and significant consumer harm. (FG24/1 1.6, 3.19)" }
                ]
            },
            {
                id: "section6",
                title: "Section 6: Approval, Record Keeping & Ongoing Monitoring",
                intro: "This section deals with the responsibilities of firms that approve financial promotions for unauthorised persons, as well as general record-keeping obligations and the crucial aspect of ongoing monitoring.",
                items: [
                    { id: "6.1", question: "Approver Due Diligence: If approving an FP for an unauthorised person, has the firm conducted thorough due diligence on the unauthorised person AND the product/service being promoted (including its authenticity, commercial viability, and the reasonableness of advertised returns)?", ref: "PS23/13 (Annex 3: 17-29)", explanation: "Before an authorised firm approves an FP for an unauthorised person, it must conduct due diligence. This includes checking the unauthorised person (e.g., their background) and scrutinising the product/service to ensure claims are fair, clear, not misleading, and the proposition is genuine and commercially viable. (PS23/13 Annex 3, paras 19-21)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Approvers must satisfy themselves that the promotion is fair, clear, not misleading, and that the underlying proposition is genuine and viable. Insufficient due diligence by the approver is a key area of FCA concern. (PS23/13 Annex 3: 19-21)" },
                    { id: "6.2", question: "Ongoing Monitoring (by Approver): Does the firm have robust procedures to monitor the continuing compliance of approved FPs for their entire lifetime (including obtaining quarterly attestations from the unauthorised person and actively checking for changes)?", ref: "COBS 4.10.2R(1A), (1B); PS23/13 (Annex 3: 38-41)", explanation: "Approving a promotion isn't a one-off task. The approving firm must monitor it for as long as it's being communicated to ensure it remains compliant. This includes getting quarterly confirmations from the unauthorised person that nothing material has changed. (COBS 4.10.2R(1A), PS23/13 Annex 3, para 38, 40)", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Approval is not a one-off task. Ongoing monitoring is a critical requirement to ensure the FP remains compliant and to withdraw approval if it no longer is. Failure to monitor is a breach. (COBS 4.10.2R(1A))" },
                    { id: "6.3", question: "Record Keeping: Are adequate records of all FPs (communicated, approved, or compliance-confirmed), including competence and expertise assessments and due diligence, made and retained for the correct periods as per COBS 4.11?", ref: "COBS 4.11", explanation: "Firms must keep records of FPs they communicate or approve, including evidence of how they satisfied competence and expertise requirements. Retention periods vary by product (e.g., 3 years, 5 years for MiFID, 6 years for pensions/life policies, indefinitely for pension transfers). (COBS 4.11.1R, 4.11.1R(2B))", notes: "", answer: null, type: "yesno", complianceImplicationIfNo: "Failure to keep adequate and appropriate records is a breach of FCA rules and hinders compliance oversight. (COBS 4.11.1R)" }
                ]
            }
        ];

// This line makes the data available to other files
module.exports = { checklistData };