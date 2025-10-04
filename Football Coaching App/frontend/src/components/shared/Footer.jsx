import React from 'react';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

// A simple Logo component for the footer
const Logo = () => (
    <span className="text-2xl font-bold text-slate-800">
        Tact<span className="text-cyan-600">AI</span>c
    </span>
);

// Reusable component for footer links
const FooterLink = ({ href, children }) => (
    <a href={href} className="text-sm text-slate-500 hover:text-cyan-600 transition-colors">
        {children}
    </a>
);

// Reusable component for social media icons
const SocialIcon = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} aria-label={ariaLabel} className="text-slate-400 hover:text-cyan-600 transition-colors">
        {children}
    </a>
);

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand and Copyright Section */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-slate-500">
              The ultimate tactical co-pilot for modern football coaching.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              &copy; {new Date().getFullYear()} TactAIQ. All rights reserved.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><FooterLink href="#">Features</FooterLink></li>
              <li><FooterLink href="#">Pricing</FooterLink></li>
              <li><FooterLink href="#">Updates</FooterLink></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><FooterLink href="#">About</FooterLink></li>
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Contact</FooterLink></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons at the bottom */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center">
            <p className="text-sm text-slate-400">Built for coaches, by coaches.</p>
            <div className="flex space-x-6">
                <SocialIcon href="https://twitter.com" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon href="https://facebook.com" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                </SocialIcon>
                <SocialIcon href="https://linkedin.com" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5" />
                </SocialIcon>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
