export type Person = {
  name: string;
  role: string;
  avatar: string;
  email: string;
  location: string;
  locationLabel?: string;
  languages?: string[];
  locale?: string;
};

export type Social = Array<{
  name: string;
  link: string;
}>;

export type Home = {
  path: string;
  image: string;
  label: string;
  title: string;
  description: string;
};

export type About = {
  path: string;
  label: string;
  title: string;
  description: string;
  intro: {
    display: boolean;
    title: string;
    description: string;
  };
  work: {
    display: boolean;
    title: string;
    experiences: Array<{
      company: string;
      role: string;
      timeframe: string;
      achievements: string[];
    }>;
  };
  studies: {
    display: boolean;
    title: string;
    institutions: Array<{
      name: string;
      description: string;
    }>;
  };
  technical: {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description: string;
      tags?: Array<{ name: string; icon?: string }>;
    }>;
  };
  calendar: {
    display: boolean;
    link: string;
  };
};

export type Blog = {
  path: string;
  label: string;
  title: string;
  description: string;
};

export type Work = {
  path: string;
  label: string;
  title: string;
  description: string;
};
