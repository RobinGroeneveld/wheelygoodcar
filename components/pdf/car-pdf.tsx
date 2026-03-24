import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// ──────────────────────────────────────────────
// Types (matcht jouw prisma select in route.ts)
// ──────────────────────────────────────────────
type CarPdfProps = {
  car: {
    make: string;
    model: string;
    license_plate: string;
    price: number | { toNumber: () => number };
    mileage: number;
    seats?: number | null;
    doors?: number | null;
    production_year?: number | null;
    weight?: number | null;
    color?: string | null;
  };
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 0,
  },

  // Header
  header: {
    backgroundColor: '#0f172a',
    padding: '28 36',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
  },
  brandSub: {
    color: '#94a3b8',
    fontSize: 8,
    marginTop: 3,
  },
  kenteken: {
    backgroundColor: '#facc15',
    color: '#0f172a',
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 4,
    letterSpacing: 2,
  },

  // Hero prijs blok
  heroBanner: {
    backgroundColor: '#0e7490',
    padding: '20 36',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
  },
  heroYear: {
    color: '#bae6fd',
    fontSize: 13,
    marginTop: 4,
  },
  heroPrice: {
    color: '#ffffff',
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
  },
  heroPriceLabel: {
    color: '#bae6fd',
    fontSize: 9,
    marginBottom: 4,
    textAlign: 'right',
  },

  // Inhoud
  body: {
    padding: '28 36',
  },

  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Specs grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  specCard: {
    width: '47%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: '12 16',
    borderLeft: '3px solid #0e7490',
  },
  specLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 24,
  },

  // Info blok onderaan
  infoBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: '16 20',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    backgroundColor: '#0f172a',
    padding: '16 36',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 8,
  },
  footerBrand: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
});

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function toPrice(price: CarPdfProps['car']['price']): string {
  const num = typeof price === 'object' ? price.toNumber() : Number(price);
  return `€ ${num.toLocaleString('nl-NL')}`;
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export function CarPdfDocument({ car }: CarPdfProps) {
  const specs = [
    { label: 'Kilometerstand', value: `${car.mileage.toLocaleString('nl-NL')} km` },
    { label: 'Kleur',          value: car.color ?? 'Onbekend' },
    { label: 'Deuren',         value: car.doors ? `${car.doors} deuren` : '—' },
    { label: 'Zitplaatsen',    value: car.seats ? `${car.seats} stoelen` : '—' },
    { label: 'Gewicht',        value: car.weight ? `${car.weight} kg` : '—' },
    { label: 'Kenteken',       value: car.license_plate },
  ];

  return (
    <Document
      title={`${car.make} ${car.model} - Te Koop`}
      author="Wheely Good Cars"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>Wheely Good Cars</Text>
            <Text style={s.brandSub}>OFFICIËLE VOERTUIGINFORMATIE — TE KOOP</Text>
          </View>
          <Text style={s.kenteken}>{car.license_plate}</Text>
        </View>

        {/* ── Hero banner ── */}
        <View style={s.heroBanner}>
          <View>
            <Text style={s.heroTitle}>{car.make} {car.model}</Text>
            <Text style={s.heroYear}>
              {car.production_year ? `Bouwjaar ${car.production_year}` : 'Bouwjaar onbekend'}
            </Text>
          </View>
          <View>
            <Text style={s.heroPriceLabel}>VRAAGPRIJS</Text>
            <Text style={s.heroPrice}>{toPrice(car.price)}</Text>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Specificaties */}
          <Text style={s.sectionTitle}>Specificaties</Text>
          <View style={s.grid}>
            {specs.map((spec) => (
              <View key={spec.label} style={s.specCard}>
                <Text style={s.specLabel}>{spec.label}</Text>
                <Text style={s.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>

          <View style={s.divider} />

          {/* Info tekst */}
          <View style={s.infoBox}>
            <Text style={s.infoText}>
              Dit document bevat de officiële voertuiginformatie van de aangeboden auto.
              Neem contact op met de aanbieder voor een proefrit of meer informatie.
              Alle gegevens zijn onder voorbehoud van wijzigingen.
            </Text>
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>Wheely Good Cars</Text>
          <Text style={s.footerText}>
            Gegenereerd op {new Date().toLocaleDateString('nl-NL')}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
