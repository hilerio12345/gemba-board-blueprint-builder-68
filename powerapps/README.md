
# Gemba Board Power Apps Canvas Application

This directory contains the Power Apps Canvas application files for the Gemba Board Lean Management System.

## Structure

- `CanvasManifest.json` - Main application manifest defining app properties and metadata
- `Src/` - Source files containing Power Fx formulas and control definitions
  - `App.fx.yaml` - Main application initialization and global variables
  - `MainScreen.fx.yaml` - Primary screen layout with metrics table and action items
- `DataSources/` - Data source definitions for collections
  - `Metrics.json` - Metrics data structure definition
  - `ActionItems.json` - Action items data structure definition
- `Connections/` - Connection and component library references
- `Entropy/` - App checker results and metadata
- `pkgs/` - PowerShell modules for administration

## Key Features

### Metrics Dashboard
- Five key metric categories: Availability, Delivery, Quality, Cost, People
- Color-coded status indicators (Green, Yellow, Red) for each weekday
- Goal tracking with threshold parameters
- Real-time status visualization

### Action Items Management
- Continuous improvement action items tracking
- Owner assignment and due date management
- Status tracking (Not Started, In Progress, Complete, Overdue)
- 7-day maximum action item duration enforcement

### Multi-Tier Support
- Configurable tier levels (TIER 1-4)
- Board ID generation and tracking
- Directorate and office code assignment
- Line of production customization

## Power Apps Implementation Notes

### Data Collections
The app uses Power Apps collections (`colMetrics` and `colActionItems`) to store data locally within the app. In a production environment, these would typically be connected to:
- SharePoint Lists
- Microsoft Dataverse
- SQL Server
- Excel Online

### Power Fx Formulas
All business logic is implemented using Power Fx formulas, including:
- Data initialization in App.OnStart
- Dynamic color coding based on status values
- Date formatting and manipulation
- Collection management and updates

### Responsive Design
The layout is designed to work on various screen sizes within Power Apps:
- Container-based layout structure
- Responsive width calculations using Parent.Width
- Gallery controls for dynamic data display
- Proper z-index management for layering

## Deployment Instructions

1. **Import to Power Apps**:
   - Use Power Apps Studio to import the application package
   - Navigate to make.powerapps.com
   - Select "Import canvas app" and upload the package

2. **Configure Data Sources**:
   - Connect to your organization's data sources
   - Update the App.OnStart formula to pull from real data
   - Configure proper permissions and sharing

3. **Customize for Your Organization**:
   - Update directorate and office code lists in global variables
   - Modify lines of production to match your processes
   - Adjust color schemes and branding as needed

## Integration Points

### SharePoint Integration
The app is designed to integrate with SharePoint for:
- Document storage and management
- List-based data storage
- User permission management
- Workflow automation

### Power BI Integration
Support for Power BI dashboard integration:
- Data export capabilities
- Automated reporting
- Cross-tier analytics and insights

### Microsoft Teams Integration
Can be embedded in Microsoft Teams for:
- Daily standup meetings
- Gemba walks and reviews
- Collaborative action item management

## Maintenance and Updates

### Data Refresh
Collections are refreshed when:
- App starts (App.OnStart)
- Screen becomes visible (MainScreen.OnVisible)
- Manual refresh actions are triggered

### Version Control
Track changes through:
- Power Apps version history
- Export packages for backup
- Change documentation in app descriptions

This Power Apps implementation provides the same core functionality as the original React application while being fully compatible with the Microsoft Power Platform ecosystem.
