import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export interface CarPdfData {
  make: string;
  model: string;
  license_plate: string;
  price: number;
  mileage: number;
  seats?: number;
  doors?: number;
  production_year?: number;
  weight?: number;
  color?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'baseline',
  },
  label: {
    fontWeight: 'bold',
    minWidth: 110,
    marginRight: 8,
  },
  value: {
    fontWeight: 'normal',
  },
});

function formatNumber(n: number | undefined | null, digits = 0) {
  if (n == null) return 'N.v.t.';
  return n.toLocaleString('nl-NL', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatPrice(n: number | undefined | null) {
  if (n == null) return 'N.v.t.';
  return `€ ${n.toLocaleString('nl-NL')}`;
}

export function CarPdfDocument({ car }: { car: CarPdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Auto gegevens</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Merk:</Text>
          <Text style={styles.value}>{car.make || 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Model:</Text>
          <Text style={styles.value}>{car.model || 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kenteken:</Text>
          <Text style={styles.value}>{car.license_plate || 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Prijs:</Text>
          <Text style={styles.value}>{formatPrice(car.price)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kilometerstand:</Text>
          <Text style={styles.value}>{car.mileage != null ? `${formatNumber(car.mileage)} km` : 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bouwjaar:</Text>
          <Text style={styles.value}>{car.production_year || 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kleur:</Text>
          <Text style={styles.value}>{car.color || 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Deuren:</Text>
          <Text style={styles.value}>{car.doors != null ? car.doors : 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Zitplaatsen:</Text>
          <Text style={styles.value}>{car.seats != null ? car.seats : 'N.v.t.'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gewicht:</Text>
          <Text style={styles.value}>{car.weight != null ? `${formatNumber(car.weight)} kg` : 'N.v.t.'}</Text>
        </View>
      </Page>
    </Document>
  );
}
