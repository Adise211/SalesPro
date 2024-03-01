export const NavigationItems = {
  OverView: "OverView",
  Calendar: "Calendar",
  Notes: "Notes",
  Sales: "Sales",
  Settings: "Settings",
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

// export const TrackingStages = {
//   FollowUps: "followups",
//   Leads: "leads",
//   Closed: "closed"
// };

export const TrackingTypes = {
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

// export const TrackingStatusTypes = [
//   { Id: 0, Status: "Follow Ups" },
//   { Id: 1, Status: "Leads" },
//   { Id: 2, Status: "Closed" }
// ];

export const ToastMessages = {
  SuccessMessages: {
    Created: "Created Successfully!",
    Updated: "Updated Successfully!",
    Delete: "Deleted Successfully!",
    Removed: "Removed Successfully!"
  },
  ErrorMessages: {
    General: "General Error"
  }
};

export const CompanyTemp = {
  companyId: null, // String
  companyName: null, // String
  relatedEvents: [], // Array (events id)
  trackingStatus: 0, // Number
  lastUpdate: null // Number (epoch time)
};

// Template from here: https://schedule-x.dev/docs/calendar/events
export const CalendarEventTemp = {
  id: null,
  start: null,
  end: null,
  title: null,
  description: null,
  location: null,
  people: null
};
