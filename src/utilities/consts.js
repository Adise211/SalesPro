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
  statusId: 0, // Number
  email: null, //String
  phoneNumber: null, //String
  stateOrCity: null, // String,
  country: null,
  myProduct: null, // String (productId)
  notes: null, // String (noteId)
  relatedEvents: [], // Array (events id)
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
