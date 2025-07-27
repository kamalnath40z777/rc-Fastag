import React from 'react';
import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
  Font,
} from '@react-pdf/renderer';
import { Vehicle } from '@/types/Vehicle';
import { FIELD_POSITIONS, PDF_CONFIG } from '@/config/pdfLayout';

// Register fonts (optional - for better typography)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: PDF_CONFIG.pageSize.width,
    height: PDF_CONFIG.pageSize.height,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  fieldContainer: {
    position: 'absolute',
  },
  text: {
    fontFamily: 'Roboto',
  },
  multilineText: {
    fontFamily: 'Roboto',
    lineHeight: 1.2,
  },
});

interface VehiclePDFProps {
  vehicle: Vehicle;
  backgroundImageSrc?: string;
}

const VehiclePDF: React.FC<VehiclePDFProps> = ({ 
  vehicle, 
  backgroundImageSrc = PDF_CONFIG.backgroundImage 
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderField = (fieldName: keyof Vehicle, value?: string) => {
    const position = FIELD_POSITIONS[fieldName];
    if (!position || !value) return null;

    const fieldStyle = {
      ...styles.fieldContainer,
      top: position.top,
      left: position.left,
      width: position.width || 'auto',
      height: position.height || 'auto',
    };

    const textStyle = {
      ...(fieldName === 'ownerAddress' ? styles.multilineText : styles.text),
      fontSize: position.fontSize || 12,
      fontWeight: position.fontWeight || 'normal',
      color: position.color || '#000000',
    };

    return (
      <View key={fieldName} style={fieldStyle}>
        <Text style={textStyle}>{value}</Text>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Template Image */}
        <Image
          style={styles.backgroundImage}
          src={backgroundImageSrc}
        />
        
        {/* Vehicle Data Fields */}
        {renderField('vehicleNumber', vehicle.vehicleNumber)}
        {renderField('ownerName', vehicle.ownerName)}
        {renderField('vehicleClass', vehicle.vehicleClass)}
        {renderField('fuelType', vehicle.fuelType)}
        {renderField('chassisNumber', vehicle.chassisNumber)}
        {renderField('engineNumber', vehicle.engineNumber)}
        {renderField('manufacturer', vehicle.manufacturer)}
        {renderField('model', vehicle.model)}
        {renderField('registrationDate', formatDate(vehicle.registrationDate))}
        {renderField('insuranceValidTill', formatDate(vehicle.insuranceValidTill))}
        {renderField('rtoOffice', vehicle.rtoOffice)}
        {renderField('ownerAddress', vehicle.ownerAddress)}
      </Page>
    </Document>
  );
};

export default VehiclePDF;