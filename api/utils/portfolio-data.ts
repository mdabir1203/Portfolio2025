/**
 * Portfolio Data Aggregation Utility
 * Centralized data collection from all portfolio data sources
 */

import { skills } from '../../src/data/skills';
import { projects } from '../../src/data/projects';
import { services } from '../../src/data/services';
import { experiences } from '../../src/data/experience';
import { journey } from '../../src/data/journey';
import { awards } from '../../src/data/awards';
import { socialPhotos, personalityHighlights, enneagramResult } from '../../src/data/social-photos';
import { linkedinRecommendations } from '../../src/data/linkedin-recommendations';
import { assistantActs } from '../../src/data/assistant-journey';
import { trustPillars, trustPractices, trustSignals } from '../../src/data/trust';

export interface PortfolioData {
  skills: typeof skills;
  projects: typeof projects;
  services: typeof services;
  experiences: typeof experiences;
  journey: typeof journey;
  awards: typeof awards;
  socialPhotos: typeof socialPhotos;
  personalityHighlights: typeof personalityHighlights;
  enneagramResult: typeof enneagramResult;
  linkedinRecommendations: typeof linkedinRecommendations;
  assistantActs: typeof assistantActs;
  trust: {
    pillars: typeof trustPillars;
    practices: typeof trustPractices;
    signals: typeof trustSignals;
  };
  metadata: {
    lastUpdated: string;
    version: string;
    totalSections: number;
  };
}

export type PortfolioSection = 
  | 'skills' 
  | 'projects' 
  | 'services' 
  | 'experiences' 
  | 'journey' 
  | 'awards' 
  | 'socialPhotos' 
  | 'personalityHighlights' 
  | 'enneagramResult' 
  | 'linkedinRecommendations' 
  | 'assistantActs' 
  | 'trust'
  | 'all';

/**
 * Aggregates all portfolio data into a single object
 */
export function getAllPortfolioData(): PortfolioData {
  return {
    skills,
    projects,
    services,
    experiences,
    journey,
    awards,
    socialPhotos,
    personalityHighlights,
    enneagramResult,
    linkedinRecommendations,
    assistantActs,
    trust: {
      pillars: trustPillars,
      practices: trustPractices,
      signals: trustSignals,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      totalSections: 12,
    },
  };
}

/**
 * Gets a specific section of portfolio data
 */
export function getPortfolioSection(section: PortfolioSection): Partial<PortfolioData> | PortfolioData {
  if (section === 'all') {
    return getAllPortfolioData();
  }

  const allData = getAllPortfolioData();
  
  switch (section) {
    case 'skills':
      return { skills: allData.skills, metadata: allData.metadata };
    case 'projects':
      return { projects: allData.projects, metadata: allData.metadata };
    case 'services':
      return { services: allData.services, metadata: allData.metadata };
    case 'experiences':
      return { experiences: allData.experiences, metadata: allData.metadata };
    case 'journey':
      return { journey: allData.journey, metadata: allData.metadata };
    case 'awards':
      return { awards: allData.awards, metadata: allData.metadata };
    case 'socialPhotos':
      return { 
        socialPhotos: allData.socialPhotos, 
        personalityHighlights: allData.personalityHighlights,
        enneagramResult: allData.enneagramResult,
        metadata: allData.metadata 
      };
    case 'personalityHighlights':
      return { personalityHighlights: allData.personalityHighlights, metadata: allData.metadata };
    case 'enneagramResult':
      return { enneagramResult: allData.enneagramResult, metadata: allData.metadata };
    case 'linkedinRecommendations':
      return { linkedinRecommendations: allData.linkedinRecommendations, metadata: allData.metadata };
    case 'assistantActs':
      return { assistantActs: allData.assistantActs, metadata: allData.metadata };
    case 'trust':
      return { trust: allData.trust, metadata: allData.metadata };
    default:
      return { metadata: allData.metadata };
  }
}

/**
 * Validates if a section name is valid
 */
export function isValidSection(section: string): section is PortfolioSection {
  const validSections: PortfolioSection[] = [
    'skills',
    'projects',
    'services',
    'experiences',
    'journey',
    'awards',
    'socialPhotos',
    'personalityHighlights',
    'enneagramResult',
    'linkedinRecommendations',
    'assistantActs',
    'trust',
    'all',
  ];
  return validSections.includes(section as PortfolioSection);
}

