# Deo's Personal Dashboard

A comprehensive, interactive personal dashboard inspired by Tableau's design aesthetics, featuring live data integration for weather, sports, and music. Built with vanilla HTML, CSS, JavaScript, and Bootstrap.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)

## 🌟 Features

### 🎵 Music Integration
- **Spotify Playlist Embedding**: Paste any Spotify playlist URL to embed it directly in the dashboard
- **Interactive Controls**: Seamless integration with Spotify's official embed player

### 🌤️ Live Weather Data
- **Current Temperature**: Real-time weather for Charlotte, NC using multiple APIs (wttr.in, Open-Meteo)
- **Monthly Weather Charts**: Interactive Chart.js visualizations showing daily highs and lows
- **Historical & Forecast Data**: Smart data fetching based on selected month (past/current/future)
- **Fallback System**: Intelligent climate modeling when APIs are unavailable

### 🏈🏀 Live Sports Data
- **NFL Standings**: Real-time team records, points for/against from ESPN API
- **NBA Standings**: Live basketball statistics with win-loss records and scoring averages
- **Live Score Ticker**: Rotating display of current games with real-time updates
- **Team Search**: Quick lookup for specific team statistics
- **Filter Controls**: League-specific filtering for scores and standings

### 📊 Interactive Dashboard Elements
- **KPI Cards**: Key performance indicators with live data
- **Responsive Design**: Mobile-friendly Bootstrap layout
- **Export Functionality**: PNG export of weather charts
- **Reset Filters**: One-click reset for all dashboard filters

## 🚀 Quick Start

1. **Clone the repository**: `git clone [your-repo-url]`
2. **Install dependencies**: `npm install`
3. **Start the server**: `npm start` or `node server.js`
4. **Open in browser**: Navigate to `http://localhost:3000`
5. **Add profile image**: Place a file named `deo.jpeg` in the same directory (or update the image path in the HTML)

## 📁 File Structure

```
personal-dashboard/
├── index.html                # Main dashboard file
├── server.js                 # Express.js backend server
├── package.json              # Node.js dependencies
├── package-lock.json         # Dependency lock file
├── README.md                 # This documentation
└── .gitignore               # Git ignore rules
```

## 🔧 Configuration

### Profile Customization
- Update the profile image by replacing `deo.jpeg` or modifying the `src` attribute
- Change the name and location in the header section (lines 28-29)
- Modify the bio description to match your interests

### API Configuration
The dashboard uses several free APIs that don't require API keys:
- **Weather**: wttr.in and Open-Meteo (no API key needed)
- **Sports**: ESPN APIs (public endpoints)
- **Music**: Spotify embed API (no authentication required)

### Location Settings
To change the weather location from Charlotte, NC:
1. Update coordinates in `CHARLOTTE_COORDS` (line 161)
2. Modify location references in the UI text
3. Adjust climate averages in the fallback functions

## 🎮 Usage Guide

### Weather Section
- **Current Temperature**: Automatically updates every few minutes
- **Monthly Chart**: Use the month selector to view historical or forecast data
- **Data Sources**: Green indicators show live API data, gray indicates simulated data

### Sports Section
- **NFL/NBA Standings**: Click "Refresh" buttons to update with latest data
- **Search**: Use the search boxes to filter teams in each league
- **Live Ticker**: Automatically rotates through current game scores
- **League Filter**: Use the dropdown to show only NFL or NBA scores

### Music Section
- **Spotify Integration**: Paste any Spotify playlist URL and click "Embed Playlist"
- **Supported URLs**: Works with Spotify playlist links (open.spotify.com/playlist/...)

### Controls
- **Reset Filters**: Clears all search boxes and resets to default view
- **Export PNG**: Downloads the weather chart as a PNG image

## 🔌 API Integration Details

### Weather APIs
- **Primary**: wttr.in (free weather service)
- **Secondary**: Open-Meteo (open weather API)
- **Fallback**: Climate modeling based on Charlotte historical data

### Sports APIs
- **Primary**: ESPN site APIs (public endpoints)
- **Data Types**: Standings, live scores, team statistics
- **Update Frequency**: Manual refresh + automatic ticker updates

### Music APIs
- **Spotify Embed**: Official Spotify embed API
- **No Authentication**: Uses public playlist embedding

## 🎨 Design Features

### Visual Design
- **Tableau-inspired**: Clean, professional dashboard aesthetic
- **Color Scheme**: Blue accent colors with subtle gradients
- **Typography**: Inter font family for modern readability
- **Shadows**: Subtle card shadows for depth

### Responsive Layout
- **Bootstrap Grid**: Mobile-first responsive design
- **Flexible Cards**: Adapts to different screen sizes
- **Touch-friendly**: Optimized for mobile interaction

## 🔧 Technical Details

### Technologies & Frameworks

#### Backend Frameworks
- **Express.js** (v4.18.2): Web application framework for API endpoints
- **Node.js**: JavaScript runtime environment

#### HTTP & API Clients
- **node-fetch** (v2.7.0): HTTP client for making API calls

#### Middleware & Utilities
- **CORS** (v2.8.5): Cross-origin resource sharing middleware

#### Development Tools
- **Nodemon** (v3.0.1): Auto-restart development server for faster development

#### Frontend Technologies
- **Bootstrap 5.3.2**: CSS framework for responsive layout
- **Chart.js 4.4.0**: Interactive charting library
- **Vanilla JavaScript**: Frontend functionality (ES6+)
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with custom properties

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- **Lazy Loading**: APIs called only when needed
- **Error Handling**: Graceful fallbacks for API failures
- **Caching**: Minimal data storage for better performance

## 🐛 Troubleshooting

### Common Issues

**Profile image not showing:**
- Ensure `deo.jpeg` is in the same directory as the HTML file
- Check file permissions and image format (JPEG, PNG supported)

**Weather data not loading:**
- Check internet connection
- Some APIs may be temporarily unavailable (fallback data will display)
- Browser console will show specific error messages

**Sports data not updating:**
- ESPN APIs may have rate limits
- Try refreshing the page or using the refresh buttons
- Check browser console for API error messages

**Spotify embed not working:**
- Ensure the playlist URL is a valid Spotify link
- Some playlists may have embedding restrictions
- Try with a different public playlist

## 🔄 Updates & Maintenance

### Regular Updates
- **Sports Data**: Updates automatically every 2 minutes
- **Weather Data**: Updates on page refresh or month selection
- **Live Ticker**: Rotates every 5 seconds

### Manual Refresh
- Use individual refresh buttons for sports sections
- Click "Reset Filters" to refresh all data
- Reload the page for a complete refresh

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Adeola (Deo) Ekundayo**
- Location: Charlotte, NC
- Interests: Music, Sports, Data Analytics
- Contact: [Add your contact information]

## 🤝 Contributing

Feel free to fork this project and customize it for your own personal dashboard. Some ideas for enhancements:

- Add more weather locations
- Integrate additional sports leagues
- Add social media feeds
- Include calendar integration
- Add more chart types

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all dependencies are loading correctly
4. Verify internet connection for live data features

---

*Built with ❤️ for data enthusiasts who love clean, interactive dashboards*
