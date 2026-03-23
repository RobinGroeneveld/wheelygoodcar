import { PrismaClient } from "../generated/prisma";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ----------------------------------------------
// Help functions
// ----------------------------------------------
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomItems<T>(arr: T[], min: number, max: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, randomInt(min, max));
}

function randomLicensePlate() {
  const letters = "ABCDEFGHJKLMNPRSTUVWXYZ";
  const digits = "0123456789";
  const L = () => letters[randomInt(0, letters.length - 1)];
  const D = () => digits[randomInt(0, 9)];
  return `${L()}${L()}-${D()}${D()}${D()}-${L()}${L()}`;
}

// --------------------------------------------
// datasets
// -------------------------------------------
const MAKES_MODELS: Record<string, string[]> = {
  Volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "ID.4", "Touareg"],
  BMW: ["1 Serie", "3 Serie", "5 Serie", "X3", "X5", "M3"],
  Mercedes: ["A-Klasse", "C-Klasse", "E-Klasse", "GLA", "GLC", "Sprinter"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
  Toyota: ["Yaris", "Corolla", "RAV4", "Prius", "Aygo", "Camry"],
  Ford: ["Fiesta", "Focus", "Kuga", "Puma", "Mustang", "Transit"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Grandland"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Zoe", "Arkana"],
  Peugeot: ["208", "308", "3008", "5008", "e-208", "Partner"],
  Seat: ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco"],
  Skoda: ["Fabia", "Octavia", "Superb", "Karoq", "Kodiaq"],
  Hyundai: ["i10", "i20", "i30", "Tucson", "Santa Fe", "Ioniq 5"],
  Kia: ["Picanto", "Rio", "Ceed", "Sportage", "Sorento", "EV6"],
  Volvo: ["V40", "V60", "V90", "XC40", "XC60", "XC90"],
  Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf"],
  Mazda: ["Mazda2", "Mazda3", "CX-3", "CX-5", "MX-5"],
  Honda: ["Jazz", "Civic", "HR-V", "CR-V", "e"],
  Fiat: ["500", "Panda", "Tipo", "500X", "Doblo"],
  Citroën: ["C1", "C3", "C4", "C5 Aircross", "Berlingo"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
};

const COLORS = [
  "Zwart", "Wit", "Grijs", "Zilver", "Blauw", "Rood",
  "Groen", "Bruin", "Beige", "Oranje", "Geel", "Paars",
];

const FIRST_NAMES = [
  "Jan", "Piet", "Kees", "Anna", "Emma", "Lotte", "Sophie", "Lars",
  "Tim", "Tom", "Sander", "Bas", "Mark", "Lisa", "Julia", "Noor",
  "Daan", "Finn", "Roos", "Eva", "Joris", "Mats", "Lena", "Iris",
  "Ruben", "Dylan", "Thijs", "Jasper", "Mia", "Sara", "Rick", "Roy",
];

const LAST_NAMES = [
  "de Vries", "Jansen", "de Jong", "Bakker", "Visser", "Smit",
  "Meijer", "de Boer", "Mulder", "van den Berg", "van Dijk",
  "Bos", "Hendriks", "Vermeer", "Peters", "Jacobs", "van Leeuwen",
  "Kuiper", "Lammers", "Willems", "Groen", "Brouwer", "Peeters",
];

const TAGS_DATA = [
  { name: "Elektrisch",     color: "#22c55e" },
  { name: "Hybride",        color: "#84cc16" },
  { name: "Automaat",       color: "#3b82f6" },
  { name: "Handgeschakeld", color: "#6366f1" },
  { name: "4x4",            color: "#f59e0b" },
  { name: "Lage km-stand",  color: "#10b981" },
  { name: "Nieuw model",    color: "#ec4899" },
  { name: "Navi",           color: "#0ea5e9" },
  { name: "Trekhaak",       color: "#8b5cf6" },
  { name: "Panoramadak",    color: "#f97316" },
  { name: "Stoelverwarming",color: "#ef4444" },
  { name: "Leder",          color: "#a16207" },
  { name: "Sportuitvoering",color: "#dc2626" },
  { name: "7-zitter",       color: "#0891b2" },
  { name: "Youngtimer",     color: "#d97706" },
  { name: "Occasion",       color: "#64748b" },
  { name: "Dealer",         color: "#2563eb" },
  { name: "Inruilauto",     color: "#7c3aed" },
  { name: "APK nieuw",      color: "#16a34a" },
  { name: "Direct rijden",  color: "#059669" },
];

// --------------------------------------------
// Seeder
// ---------------------------------------------
async function main() {
  console.log("Seeding gestart...\n");

  // empty the database
  await prisma.car_tag.deleteMany();
  await prisma.cars.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("Deleted the data");

  // ---------------Tags----------------------------
  const createdTags = await Promise.all(
    TAGS_DATA.map((tag) =>
      prisma.tags.create({ data: tag })
    )
  );
  console.log(`${createdTags.length} tags created`);

  // ---------250 users-----------------
  const usedEmails = new Set<string>();
  const usersData = Array.from({ length: 150 }, () => {
    const firstName = randomItem(FIRST_NAMES);
    const lastName  = randomItem(LAST_NAMES);
    const name      = `${firstName} ${lastName}`;

    let email: string;
    do {
      const tag = randomInt(1, 9999);
      email = `${firstName.toLowerCase()}.${lastName
        .toLowerCase()
        .replace(/\s/g, "")}${tag}@example.com`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const now = new Date();
    return {
      id:            randomUUID(),
      name,
      email,
      emailVerified: true,
      image:         null,
      createdAt:     now,
      updatedAt:     now,
      phone_number:  `06${randomInt(10000000, 99999999)}`,
    };
  });

  await prisma.user.createMany({ data: usersData });
  console.log(`${usersData.length} users created`);

  // -------------250 cars --------------------
  const makes   = Object.keys(MAKES_MODELS);
  const carsData = Array.from({ length: 250 }, () => {
    const make   = randomItem(makes);
    const model  = randomItem(MAKES_MODELS[make]);
    const year   = randomInt(2000, 2024);
    const userId = randomItem(usersData).id;

    return {
      userId,
      license_plate:   randomLicensePlate(),
      make,
      model,
      price:           randomInt(2000, 85000),
      mileage:         randomInt(0, 350000),
      seats:           randomItem([2, 4, 5, 7]),
      doors:           randomItem([2, 3, 4, 5]),
      production_year: year,
      weight:          randomInt(900, 3500),
      color:           randomItem(COLORS),
      image:           null,
      sold_at:         Math.random() < 0.1 ? new Date() : null,
      views:           randomInt(0, 500),
    };
  });

  await prisma.cars.createMany({ data: carsData });
  console.log(`${carsData.length} cars created`);

  // --------------- Car-tags linked -----------------------
  const allCars = await prisma.cars.findMany({ select: { id: true } });

  const carTagData = allCars.flatMap((car) => {
    const selectedTags = randomItems(createdTags, 1, 4);
    return selectedTags.map((tag) => ({
      car_id: car.id,
      tag_id: tag.id,
    }));
  });

  await prisma.car_tag.createMany({ data: carTagData });
  console.log(`${carTagData.length} car-tag links created`);

  //-------------summary ---------------------
  console.log("Seeding successful!");
}

main()
  .catch((e) => {
    console.error(" Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });