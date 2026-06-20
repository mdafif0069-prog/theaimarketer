import React from 'react';
import {
  BookOpen, Scale, Heart, Star, Coins, Users, Smile, Languages, MapPin, Sprout,
  Moon, Sun, UserCheck, Radio,
} from 'lucide-react';

const MAP = {
  BookOpen, Scale, Heart, Star, Coins, Users, Smile, Languages, MapPin, Sprout,
  Moon, Sun, UserCheck, Radio,
};

export function Icon({ name, ...props }) {
  const Cmp = MAP[name] || Star;
  return <Cmp {...props} />;
}
