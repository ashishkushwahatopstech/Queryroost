import React, { useState, useEffect } from 'react';
import { Eye, ShieldCheck, Zap, Code } from 'lucide-react';
import { MetaOptimizer } from '../components/tools/MetaOptimizer';
import { SiteAuditor } from '../components/tools/SiteAuditor';
import { PageSpeedInspector } from '../components/tools/PageSpeedInspector';
import { SchemaValidator } from '../components/tools/SchemaValidator';

interface ToolsPageProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ currentPath, navigate }) => {
  const [activeTool, setActiveTool] = useState<string>('meta');

  useEffect(() => {
    if (currentPath.includes('/tools/site-audit')) setActiveTool('audit');
    else if (currentPath.includes('/tools/pagespeed')) setActiveTool('pagespeed');
    else if (currentPath.includes('/tools/schema-validator')) setActiveTool('schema');
    else setActiveTool('meta');
  }, [currentPath]);

  const selectTool = (toolKey: string, path: string) => {
    setActiveTool(toolKey);
    navigate(path);
  };

  const coreTools = [
    { key: 'meta', label: 'SERP & Meta Optimizer', path: '/tools/meta-optimizer', icon: Eye, desc: 'Live SERP simulator with pixel truncation gauge & CTR predictor' },
    { key: 'audit', label: 'Technical Site Auditor', path: '/tools/site-audit', icon: ShieldCheck, desc: 'Deep crawler for 404 broken links, titles, H1s & alt tags with fix guides' },
    { key: 'pagespeed', label: 'PageSpeed & Core Web Vitals', path: '/tools/pagespeed', icon: Zap, desc: 'LCP, CLS, INP diagnostics powered by Google PageSpeed Insights API' },
    { key: 'schema', label: 'Schema Rich Result Simulator', path: '/tools/schema-validator', icon: Code, desc: 'JSON-LD validator & live Google FAQ accordion rich snippet simulator' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 4 Core Tools Selector Tabs Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {coreTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.key;
          return (
            <div
              key={tool.key}
              onClick={() => selectTool(tool.key, tool.path)}
              className={`p-4 rounded-3xl cursor-pointer transition flex flex-col justify-between border ${
                isActive
                  ? 'glass-card border-emerald-400 shadow-lg shadow-emerald-500/10 bg-gradient-to-b from-emerald-50/60 to-white'
                  : 'glass-card hover:bg-slate-100/60 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-xl border ${isActive ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">{tool.label}</h3>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{tool.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Active Core Tool Component */}
      {activeTool === 'meta' && <MetaOptimizer />}
      {activeTool === 'audit' && <SiteAuditor />}
      {activeTool === 'pagespeed' && <PageSpeedInspector />}
      {activeTool === 'schema' && <SchemaValidator />}

    </div>
  );
};
