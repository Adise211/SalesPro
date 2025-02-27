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
