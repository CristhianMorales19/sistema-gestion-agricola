export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  active: boolean;
  permissions?: string[];
}

export interface SidebarNavigation {
  items: NavigationItem[];
  userSection: {
    profile: UserProfile;
    actions: NavigationAction[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
}

export interface NavigationAction {
  id: string;
  label: string;
  action: string;
  icon?: string;
}
