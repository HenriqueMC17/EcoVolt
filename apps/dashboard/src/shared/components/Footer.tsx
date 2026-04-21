import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-main border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-primary fill-primary" size={24} />
              <Typography variant="h4" className="text-lg font-bold tracking-tighter">
                ECOVOLT
              </Typography>
            </div>
            <Typography variant="muted" className="mb-6">
              Empowering the world's leading enterprises with high-fidelity energy intelligence.
            </Typography>
            <div className="flex gap-4">
              <Github size={20} className="text-text-muted hover:text-white cursor-pointer" />
              <Twitter size={20} className="text-text-muted hover:text-white cursor-pointer" />
              <Linkedin size={20} className="text-text-muted hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <Typography variant="h4" className="text-sm font-bold uppercase tracking-widest mb-6">Solutions</Typography>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Grid Analytics</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Demand Response</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Energy Trading</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Asset Management</a></li>
            </ul>
          </div>

          <div>
            <Typography variant="h4" className="text-sm font-bold uppercase tracking-widest mb-6">Company</Typography>
            <ul className="space-y-4">
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <Typography variant="h4" className="text-sm font-bold uppercase tracking-widest mb-6">Stay Updated</Typography>
            <Typography variant="muted" className="mb-4">Subscribe to our newsletter for the latest in energy intelligence.</Typography>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
              <button className="bg-primary text-black font-bold py-2 px-4 rounded-lg text-sm hover:bg-primary-hover transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography variant="muted" className="text-xs">
            © 2024 EcoVolt Technologies Inc. All rights reserved.
          </Typography>
          <div className="flex gap-8 text-xs text-text-muted">
            <a href="#" className="hover:text-white">Security</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">GDPR</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
