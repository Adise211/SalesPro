export const ResultCodes = Object.freeze({
  Error: -1,
  Success: 1
});

export const NavigationItems = {
  Home: "Home",
  Calendar: "Calendar",
  Sales: "Sales",
  Products: "Products",
  Customers: "Customers",
  Teams: "Teams",
  Files: "Files",
  MyAccount: "MyAccount",
  Logout: "Logout"
};

export const CalendarEventColors = {
  Gray: "gray",
  Red: "red",
  Orange: "orange",
  Yellow: "yellow",
  Green: "green",
  Teal: "teal",
  Blue: "blue",
  Indigo: "indigo",
  Purple: "purple",
  Pink: "pink"
};

export const SalesStatusId = {
  Follow: 1,
  Leads: 2,
  Closed: 3
};

export const SalesStatusText = {
  Follow: "follow",
  Leads: "leads",
  Closed: "closed"
};

export const SaleStatuses = {
  FollowUps: {
    id: 1,
    value: "followups",
    title: "Follow Ups" // For display
  },
  Leads: {
    id: 2,
    value: "leads",
    title: "Leads" // For display
  },
  Closed: {
    id: 3,
    value: "closed",
    title: "Closed" // For display
  }
};

export const ToastMessages = {
  SuccessMessages: {
    Created: "Created Successfully!",
    Updated: "Updated Successfully!",
    Delete: "Deleted Successfully!",
    Removed: "Removed Successfully!"
  },
  ErrorMessages: {
    General: "General Error",
    Created: "Failed to create",
    Updated: "Failed to update",
    Delete: "Failed to delete",
    Removed: "Failed to remove"
  }
};

export const BusinessSectors = [
  "Construction",
  "Education",
  "Food Manufacturing",
  "Transportation",
  "Business computing specialist",
  "Human Services",
  "Real estate",
  "Metal fabrication",
  "Insurance",
  "Energy",
  "Technology",
  "Utilities",
  "Coal",
  "Investment consultant",
  "Retail",
  "Food and beverage"
];

export const SalesReminderFrequency = {
  Daily: 1,
  Weekly: 2,
  Monthly: 3
};

export const TableColumnsWidthValue = {
  XSmall: "5%",
  Small: "10%",
  Medium: "15%",
  Large: "20%"
};
