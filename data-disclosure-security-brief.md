# Build Brief — Data Disclosure Page: Security Section & Updates
**Project:** HavenQuest
**Date:** June 2, 2026
**Status:** PENDING — Ready for Claude Code
**Priority:** High — beta user trust
**Prepared by:** Claude (COO)
**Approved by:** Craig Asbach

---

## Overview

Four changes to `app/data-disclosure/page.tsx`:

1. Add a new Security & Privacy section at the top of the page — leads with data security before anything else
2. Update email from grandhavenpartners.llc@gmail.com to admin@havenquest.co
3. Update "12 lifestyle categories" to "13 lifestyle categories" throughout
4. Update Must Have max from "Up to 3 categories" to "Up to 4 categories"

---

## File to Change

`app/data-disclosure/page.tsx` only.

---

## Change 1 — New Security & Privacy Section

Insert this new section FIRST — before the existing Purpose section. This becomes the first thing a visitor sees after the page header.

Add this section immediately after the opening `<div className="space-y-5">` tag:

```tsx
{/* Security & Privacy — NEW LEAD SECTION */}
<section className="bg-white rounded-2xl border border-gray-100 p-6" style={cardStyle}>
  <div className="flex items-start gap-3 mb-5">
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
         style={{ backgroundColor: '#E8F5EE' }}>
      <span className="text-lg">🔒</span>
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-900 tracking-tight">
        Your Data Is Secure
      </h2>
      <p className="text-sm text-gray-500 mt-0.5">
        Here is exactly how HavenQuest protects your information.
      </p>
    </div>
  </div>

  {/* Security infrastructure */}
  <div className="grid sm:grid-cols-2 gap-3 mb-6">
    {[
      {
        icon: '🏛️',
        title: 'SOC 2 Type II Certified Infrastructure',
        body: 'Your data is stored on Supabase — a SOC 2 Type II certified platform used by thousands of companies worldwide. SOC 2 certification means independent auditors have verified that the platform meets rigorous standards for security, availability, and confidentiality.',
      },
      {
        icon: '🔐',
        title: 'Encryption In Transit & At Rest',
        body: 'All data transmitted between your browser and HavenQuest is encrypted using TLS (Transport Layer Security). All data stored in our database is encrypted at rest. Your information cannot be read by unauthorized parties.',
      },
      {
        icon: '🛡️',
        title: 'Secure Authentication',
        body: 'Passwords are never stored in plain text. HavenQuest uses industry-standard bcrypt hashing via Supabase Auth. Sessions are managed using httpOnly cookies — they are not accessible to JavaScript or browser extensions.',
      },
      {
        icon: '🚫',
        title: 'No Data Selling. Ever.',
        body: 'HavenQuest does not sell your personal data to any third party. We do not share your information with realtors without your explicit consent through the introduction process. We do not run advertising or share data with ad networks.',
      },
      {
        icon: '👁️',
        title: 'Limited Access',
        body: 'Your data is accessible only to you and HavenQuest staff directly involved in your relocation journey. Market Directors only see the profiles of clients assigned to them. No one else has access to your personal information.',
      },
      {
        icon: '🗑️',
        title: 'Your Right to Delete',
        body: 'You can request deletion of your account and all associated data at any time by emailing admin@havenquest.co. We will process all deletion requests within 30 days.',
      },
    ].map(item => (
      <div key={item.title}
           className="rounded-xl p-4"
           style={{ backgroundColor: '#F7F6F3' }}>
        <div className="flex items-start gap-2.5 mb-2">
          <span className="text-base shrink-0">{item.icon}</span>
          <p className="text-sm font-bold text-gray-800">{item.title}</p>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{item.body}</p>
      </div>
    ))}
  </div>

  {/* What we collect */}
  <div className="mb-5">
    <h3 className="text-sm font-bold text-gray-800 mb-3">What We Collect & Why</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <TableHeader cols={['Data', 'Why We Collect It', 'Who Sees It']} />
        <tbody className="divide-y divide-gray-100">
          {[
            ['Name, email, phone', 'Account creation and communication', 'HavenQuest staff only'],
            ['Income & financial picture', 'Affordability matching algorithm', 'HavenQuest staff, assigned Market Director'],
            ['Lifestyle priorities', 'City matching algorithm', 'HavenQuest staff, assigned Market Director'],
            ['City match results', 'Portal personalization', 'You and HavenQuest staff'],
            ['Family profile (optional)', 'Market Director preparation', 'Your assigned Market Director'],
            ['Notes & checklist', 'Your personal relocation tracking', 'You and your assigned Market Director'],
          ].map(([data, why, who]) => (
            <tr key={data}>
              <td className="py-2.5 pr-4 font-medium text-gray-700 text-xs">{data}</td>
              <td className="py-2.5 pr-4 text-gray-500 text-xs">{why}</td>
              <td className="py-2.5 text-gray-400 text-xs">{who}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Contact */}
  <div className="rounded-xl p-4" style={{ backgroundColor: '#F0FAF4', border: '1px solid #C6E8D4' }}>
    <p className="text-sm font-bold text-gray-800 mb-1">Questions about your data?</p>
    <p className="text-xs text-gray-500 leading-relaxed">
      Contact us at{' '}
      <a href="mailto:admin@havenquest.co"
         className="font-semibold underline underline-offset-2"
         style={{ color: '#2D7D4E' }}>
        admin@havenquest.co
      </a>
      {' '}— we respond to all data-related inquiries within 48 hours.
    </p>
  </div>
</section>
```

---

## Change 2 — Update Email in Section 7

Find:
```tsx
<p><strong className="text-gray-700">Email:</strong> <span className="text-gray-500">grandhavenpartners.llc@gmail.com</span></p>
```

Replace with:
```tsx
<p><strong className="text-gray-700">Email:</strong> <a href="mailto:admin@havenquest.co" className="text-gray-500 underline underline-offset-2">admin@havenquest.co</a></p>
```

---

## Change 3 — Update 12 to 13 Lifestyle Categories

Find every instance of "12 lifestyle categories" or "12 Lifestyle Category" in the file and replace with "13":

- Section 2 heading: "2.1 The 12 Lifestyle Category Scores" → "2.1 The 13 Lifestyle Category Scores"
- Section 2 paragraph: "Every city in the HavenQuest database is scored on 12 lifestyle categories" → "13 lifestyle categories"
- Section 3 paragraph: "Users assign each of the 12 lifestyle categories" → "each of the 13 lifestyle categories"

Also add Healthcare to the Section 2.1 scores table after Traffic:
```tsx
['Healthcare', 'Access to hospitals, specialists, and medical facilities', 'Hospital proximity, USNWR regional rankings, CMS hospital quality data'],
```

---

## Change 4 — Update Must Have Max from 3 to 4

Find in the Section 3 table:
```tsx
['Must Have', '3×', 'Up to 3 categories'],
```

Replace with:
```tsx
['Must Have', '3×', 'Up to 4 categories'],
```

---

## Acceptance Criteria

- [ ] New Security & Privacy section appears first on the page before Purpose
- [ ] Security section has 6 security feature cards in a 2-column grid
- [ ] "What We Collect & Why" table renders correctly
- [ ] admin@havenquest.co contact in security section
- [ ] Section 7 email updated to admin@havenquest.co as a mailto link
- [ ] All instances of "12 lifestyle categories" updated to "13"
- [ ] Healthcare added to the Section 2.1 scores table
- [ ] Must Have max updated from "Up to 3" to "Up to 4"
- [ ] tsc --noEmit passes clean
- [ ] No other sections changed

---

*Brief prepared by Claude (COO) — June 2, 2026. Approved by Craig Asbach.*
