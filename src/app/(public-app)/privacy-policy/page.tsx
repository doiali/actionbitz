import { Metadata } from 'next'
import PrivacyPolicy from './privacy-policy.mdx';

export const metadata: Metadata = {
  title: 'Actionbitz - Privacy Policy',
  description: 'Read the privacy policy of Actionbitz to understand how we handle your data and privacy.',
  keywords: ['privacy policy', 'Actionbitz', 'data privacy', 'user data'],
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container prose dark:prose-invert mx-auto my-16">
      <PrivacyPolicy />
    </div>
  );
}