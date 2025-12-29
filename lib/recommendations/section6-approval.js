// Section 6: Approval, Record Keeping & Monitoring

export const section6_approval = {
  "6.1": {
    // Approver due diligence on unauthorised person and product
    ifNo: {
      priority: "critical",
      title: "Conduct Thorough Approver Due Diligence",
      summary: "Before approving, verify the unauthorised person and product are genuine",
      actions: [
        {
          step: 1,
          action: "Due diligence on the unauthorised person",
          detail: "Verify: identity, background checks, regulatory history, financial standing, business legitimacy."
        },
        {
          step: 2,
          action: "Due diligence on the product/service",
          detail: "Assess: Does the product exist? Is it commercially viable? Are advertised returns reasonable and achievable?"
        },
        {
          step: 3,
          action: "Review the promotion for fair, clear, not misleading",
          detail: "Ensure all claims are substantiated. Check that the promotion meets all applicable rules."
        },
        {
          step: 4,
          action: "Document your due diligence",
          detail: "Keep comprehensive records of all checks performed, evidence obtained, and conclusions reached."
        },
        {
          step: 5,
          action: "Decline if due diligence raises concerns",
          detail: "If anything is unclear or concerning, do not approve. The reputational and regulatory risk is significant."
        }
      ],
      templateText: null,
      fcaRef: "PS23/13 Annex 3: 17-29",
      riskIfIgnored: "Approving without proper due diligence is a key FCA concern. Approvers have faced enforcement for inadequate DD."
    }
  },

  "6.2": {
    // Ongoing monitoring of approved promotions
    ifNo: {
      priority: "high",
      title: "Implement Ongoing Monitoring Procedures",
      summary: "Continue to monitor approved promotions throughout their lifetime",
      actions: [
        {
          step: 1,
          action: "Establish a monitoring schedule",
          detail: "Set regular reviews (at least quarterly) of all live approved promotions."
        },
        {
          step: 2,
          action: "Obtain quarterly attestations",
          detail: "Get written confirmation from the unauthorised person each quarter that nothing material has changed."
        },
        {
          step: 3,
          action: "Actively check for changes",
          detail: "Don't just rely on attestations. Periodically check the live promotion matches what was approved."
        },
        {
          step: 4,
          action: "Withdraw approval if needed",
          detail: "If the promotion becomes non-compliant or the product/firm situation changes materially, withdraw approval immediately."
        },
        {
          step: 5,
          action: "Keep records of monitoring",
          detail: "Document all monitoring activities, attestations received, and any issues identified."
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.10.2R(1A), (1B), PS23/13 Annex 3: 38-41",
      riskIfIgnored: "Approval is not a one-off. Failure to monitor is a breach and can lead to ongoing non-compliant promotions."
    }
  },

  "6.3": {
    // Record keeping
    ifNo: {
      priority: "high",
      title: "Establish Compliant Record Keeping",
      summary: "Maintain adequate records for required retention periods",
      actions: [
        {
          step: 1,
          action: "Identify all records required",
          detail: "Records include: copies of promotions, approval documentation, due diligence, competence assessments, monitoring records."
        },
        {
          step: 2,
          action: "Set up appropriate retention periods",
          detail: "Minimum 3 years, 5 years for MiFID business, 6 years for pensions/life policies, indefinitely for pension transfers."
        },
        {
          step: 3,
          action: "Implement secure storage",
          detail: "Ensure records are stored securely but accessibly. Consider digital archiving with appropriate backups."
        },
        {
          step: 4,
          action: "Create retrieval processes",
          detail: "You must be able to retrieve records for FCA requests. Ensure quick and reliable access."
        },
        {
          step: 5,
          action: "Audit record keeping periodically",
          detail: "Regularly check that record keeping obligations are being met across the business."
        }
      ],
      templateText: null,
      fcaRef: "COBS 4.11",
      riskIfIgnored: "Poor record keeping is a common compliance failing and hinders regulatory supervision."
    }
  }
};
