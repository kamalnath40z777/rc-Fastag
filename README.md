# Vehicle PDF Generator - React Web Application

A comprehensive React-based web application for managing vehicle records and generating professional PDF documents with custom background templates.

## Features

- **Vehicle Database Management**: Complete CRUD operations for vehicle records
- **Custom PDF Generation**: Generate PDFs with background template images and precise field positioning
- **Bulk Export**: Select multiple vehicles and export as ZIP archive
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Search & Filter**: Advanced search capabilities across all vehicle fields
- **Template Configuration**: Easily configurable field positions via JSON mapping

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **UI Components**: shadcn/ui
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Vite
- **Deployment**: Static hosting compatible

## Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── VehiclePDF.tsx         # PDF document component
│   ├── VehicleForm.tsx        # Vehicle form component
│   ├── VehicleDashboard.tsx   # Main dashboard
│   └── ...
├── config/
│   └── pdfLayout.ts           # PDF field positioning config
├── services/
│   └── vehicleService.ts      # Vehicle data service
├── types/
│   └── Vehicle.ts             # TypeScript interfaces
├── pages/
│   ├── Index.tsx              # Home page
│   ├── VehicleManagement.tsx  # Vehicle management page
│   └── NotFound.tsx           # 404 page
└── ...
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd vehicle-pdf-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Add your background template image**
   - Place your vehicle template image in `public/assets/`
   - Recommended filename: `vehicle-template.jpg`
   - Recommended size: A4 dimensions (595x842 pixels at 72 DPI)
   - Update the path in `src/config/pdfLayout.ts` if needed

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
   - Navigate to `http://localhost:8080`
   - The application will be running with hot reload

## Configuration

### PDF Layout Configuration

Edit `src/config/pdfLayout.ts` to customize field positions:

```typescript
export const FIELD_POSITIONS: Record<string, FieldPosition> = {
  vehicleNumber: {
    top: 180,        // Y position in points
    left: 200,       // X position in points
    width: 200,      // Field width (optional)
    fontSize: 14,    // Font size
    fontWeight: 'bold',
    color: '#000000',
  },
  // ... other fields
};
```

### Background Image Setup

1. **Prepare your template image**:
   - Convert your PDF template to JPG/PNG
   - Ensure A4 dimensions (595x842 pixels at 72 DPI)
   - Optimize for web (compress to reasonable file size)

2. **Add to project**:
   - Place in `public/assets/vehicle-template.jpg`
   - Update `PDF_CONFIG.backgroundImage` in `src/config/pdfLayout.ts`

3. **Position fields**:
   - Use browser developer tools to measure positions
   - Update coordinates in `FIELD_POSITIONS`
   - Test with sample data

## Usage Guide

### Adding Vehicles

1. Navigate to Vehicle Management (`/vehicles`)
2. Click "Add Vehicle" button
3. Fill in vehicle details (vehicle number is required)
4. Save the record

### Generating PDFs

**Single Vehicle**:
1. Find the vehicle in the dashboard
2. Click the "PDF" button
3. PDF will download automatically

**Bulk Export**:
1. Select multiple vehicles using checkboxes
2. Click "Bulk Export" button
3. ZIP file with all PDFs will download

### Managing Data

- **Search**: Use the search bar to find vehicles by any field
- **Edit**: Click the edit button to modify vehicle details
- **Delete**: Click the delete button to remove vehicles
- **Sample Data**: Use "Add Sample Data" for testing

## Deployment

### Static Hosting (Recommended)

1. **Build the project**:
```bash
npm run build
```

2. **Deploy the `dist` folder** to any static hosting service:
   - **Netlify**: Drag and drop the `dist` folder
   - **Vercel**: Connect your Git repository
   - **GitHub Pages**: Use GitHub Actions
   - **AWS S3**: Upload to S3 bucket with static hosting
   - **Firebase Hosting**: Use Firebase CLI

### Environment Variables

No environment variables are required for basic functionality. All data is stored in browser localStorage.

### Production Considerations

1. **Asset Optimization**:
   - Compress background template images
   - Enable gzip compression on your hosting service
   - Use CDN for better performance

2. **Browser Compatibility**:
   - Supports modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
   - PDF generation requires JavaScript enabled

3. **Data Persistence**:
   - Current version uses localStorage
   - For production, consider integrating with a backend database
   - Implement user authentication for multi-user scenarios

## API Integration (Optional)

For server-side PDF generation, you can create a Node.js API:

```javascript
// Example Express.js endpoint
app.post('/api/generate-pdf', async (req, res) => {
  const { vehicle } = req.body;
  const pdfDoc = <VehiclePDF vehicle={vehicle} />;
  const pdfBuffer = await pdf(pdfDoc).toBuffer();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=vehicle.pdf');
  res.send(pdfBuffer);
});
```

## Troubleshooting

### Common Issues

1. **PDF not generating**:
   - Check browser console for errors
   - Ensure background image path is correct
   - Verify all required dependencies are installed

2. **Background image not showing**:
   - Confirm image is in `public/assets/`
   - Check image format (JPG/PNG recommended)
   - Verify path in `pdfLayout.ts`

3. **Field positioning issues**:
   - Use browser developer tools to measure positions
   - Remember coordinates are in points (1 point = 1/72 inch)
   - Test with different screen sizes

### Performance Optimization

1. **Large datasets**: Implement pagination for vehicle lists
2. **PDF generation**: Consider server-side generation for bulk operations
3. **Image optimization**: Compress background templates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the configuration files
3. Open an issue on the repository

---

**Note**: This application is designed for client-side operation with localStorage. For production use with multiple users, consider implementing a proper backend database and user authentication system.