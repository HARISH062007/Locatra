"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Home, Package, Armchair, Files, Monitor, Pill,
  Shirt, UtensilsCrossed, ArrowLeft, MapPin, Tag, Clock, CheckCircle2
} from "lucide-react";

export interface InventoryCategory {
  id: string;
  label: string;
  count: number;
  icon: React.ReactNode;
}

interface InventoryItem {
  id: string;
  name: string;
  location: string;
  tag: string;
  lastSeen: string;
  status: "found" | "missing" | "packed";
}

const CATEGORY_ITEMS: Record<string, InventoryItem[]> = {
  rooms: [
    { id: "r1",  name: "Living Room",   location: "Ground Floor",  tag: "LR-001", lastSeen: "2h ago",       status: "found"   },
    { id: "r2",  name: "Master Bedroom",location: "1st Floor",     tag: "BR-001", lastSeen: "Yesterday",    status: "found"   },
    { id: "r3",  name: "Kitchen",       location: "Ground Floor",  tag: "KT-001", lastSeen: "3h ago",       status: "found"   },
    { id: "r4",  name: "Guest Room",    location: "1st Floor",     tag: "GR-001", lastSeen: "2 days ago",   status: "found"   },
    { id: "r5",  name: "Study Room",    location: "2nd Floor",     tag: "ST-001", lastSeen: "1 week ago",   status: "found"   },
    { id: "r6",  name: "Dining Room",   location: "Ground Floor",  tag: "DR-001", lastSeen: "4h ago",       status: "found"   },
    { id: "r7",  name: "Basement",      location: "Underground",   tag: "BS-001", lastSeen: "3 days ago",   status: "found"   },
    { id: "r8",  name: "Garage",        location: "Side Wing",     tag: "GG-001", lastSeen: "1 week ago",   status: "found"   },
    { id: "r9",  name: "Bathroom",      location: "Ground Floor",  tag: "BT-001", lastSeen: "30 min ago",   status: "found"   },
    { id: "r10", name: "Attic",         location: "3rd Floor",     tag: "AT-001", lastSeen: "2 weeks ago",  status: "found"   },
    { id: "r11", name: "Home Office",   location: "2nd Floor",     tag: "HO-001", lastSeen: "5h ago",       status: "found"   },
    { id: "r12", name: "Laundry Room",  location: "Ground Floor",  tag: "LY-001", lastSeen: "1 day ago",    status: "found"   },
  ],
  boxes: [
    { id: "b1",  name: "Box #01 - Books",        location: "Study Room",   tag: "BX-001", lastSeen: "Yesterday",  status: "packed"  },
    { id: "b2",  name: "Box #02 - Clothes",      location: "Bedroom",      tag: "BX-002", lastSeen: "2h ago",     status: "packed"  },
    { id: "b3",  name: "Box #03 - Kitchen",      location: "Kitchen",      tag: "BX-003", lastSeen: "1h ago",     status: "packed"  },
    { id: "b4",  name: "Box #04 - Electronics",  location: "Living Room",  tag: "BX-004", lastSeen: "3 days ago", status: "packed"  },
    { id: "b5",  name: "Box #05 - Toys",         location: "Garage",       tag: "BX-005", lastSeen: "1 week ago", status: "packed"  },
    { id: "b6",  name: "Box #06 - Documents",    location: "Study Room",   tag: "BX-006", lastSeen: "Yesterday",  status: "packed"  },
    { id: "b7",  name: "Box #07 - Fragile",      location: "Living Room",  tag: "BX-007", lastSeen: "4h ago",     status: "packed"  },
    { id: "b8",  name: "Box #08 - Bedding",      location: "Bedroom",      tag: "BX-008", lastSeen: "2 days ago", status: "packed"  },
    { id: "b9",  name: "Box #09 - Tools",        location: "Garage",       tag: "BX-009", lastSeen: "3 days ago", status: "packed"  },
    { id: "b10", name: "Box #10 - Shoes",        location: "Hallway",      tag: "BX-010", lastSeen: "Yesterday",  status: "packed"  },
    { id: "b11", name: "Box #11 - Miscellaneous",location: "Basement",     tag: "BX-011", lastSeen: "5 days ago", status: "missing" },
    { id: "b12", name: "Box #12 - Art supplies", location: "Study Room",   tag: "BX-012", lastSeen: "1 week ago", status: "packed"  },
  ],
  furniture: [
    { id: "f1",  name: "3-Seater Sofa",    location: "Living Room",  tag: "FN-001", lastSeen: "1h ago",     status: "found"   },
    { id: "f2",  name: "King Bed Frame",   location: "Bedroom",      tag: "FN-002", lastSeen: "Yesterday",  status: "found"   },
    { id: "f3",  name: "Dining Table",     location: "Dining Room",  tag: "FN-003", lastSeen: "2h ago",     status: "found"   },
    { id: "f4",  name: "Office Desk",      location: "Study Room",   tag: "FN-004", lastSeen: "3h ago",     status: "found"   },
    { id: "f5",  name: "Bookshelf",        location: "Study Room",   tag: "FN-005", lastSeen: "Yesterday",  status: "found"   },
    { id: "f6",  name: "Coffee Table",     location: "Living Room",  tag: "FN-006", lastSeen: "2h ago",     status: "found"   },
    { id: "f7",  name: "Wardrobe",         location: "Bedroom",      tag: "FN-007", lastSeen: "Yesterday",  status: "found"   },
    { id: "f8",  name: "TV Stand",         location: "Living Room",  tag: "FN-008", lastSeen: "1h ago",     status: "found"   },
    { id: "f9",  name: "Recliner Chair",   location: "Living Room",  tag: "FN-009", lastSeen: "Yesterday",  status: "found"   },
    { id: "f10", name: "Guest Bed",        location: "Guest Room",   tag: "FN-010", lastSeen: "3 days ago", status: "found"   },
  ],
  documents: [
    { id: "d1",  name: "Passport",          location: "Study Room",  tag: "DC-001", lastSeen: "1 week ago", status: "found"   },
    { id: "d2",  name: "Insurance Papers",  location: "Study Room",  tag: "DC-002", lastSeen: "2 weeks ago",status: "found"   },
    { id: "d3",  name: "House Deed",        location: "Safe Box",    tag: "DC-003", lastSeen: "1 month ago",status: "found"   },
    { id: "d4",  name: "Car Registration",  location: "Garage",      tag: "DC-004", lastSeen: "3 weeks ago",status: "found"   },
    { id: "d5",  name: "Medical Records",   location: "Study Room",  tag: "DC-005", lastSeen: "2 days ago", status: "found"   },
    { id: "d6",  name: "Tax Documents",     location: "Study Room",  tag: "DC-006", lastSeen: "1 month ago",status: "missing" },
    { id: "d7",  name: "Warranty Cards",    location: "Box #06",     tag: "DC-007", lastSeen: "Yesterday",  status: "found"   },
    { id: "d8",  name: "Utility Bills",     location: "Kitchen",     tag: "DC-008", lastSeen: "1 week ago", status: "found"   },
  ],
  electronics: [
    { id: "e1",  name: "65\" OLED TV",       location: "Living Room", tag: "EL-001", lastSeen: "2h ago",     status: "found"   },
    { id: "e2",  name: "MacBook Pro",        location: "Study Room",  tag: "EL-002", lastSeen: "30 min ago", status: "found"   },
    { id: "e3",  name: "PlayStation 5",     location: "Living Room", tag: "EL-003", lastSeen: "Yesterday",  status: "found"   },
    { id: "e4",  name: "iPad Pro",          location: "Bedroom",     tag: "EL-004", lastSeen: "4h ago",     status: "found"   },
    { id: "e5",  name: "Wireless Router",   location: "Study Room",  tag: "EL-005", lastSeen: "1 week ago", status: "found"   },
    { id: "e6",  name: "Washing Machine",   location: "Laundry",     tag: "EL-006", lastSeen: "Yesterday",  status: "found"   },
    { id: "e7",  name: "Refrigerator",      location: "Kitchen",     tag: "EL-007", lastSeen: "2h ago",     status: "found"   },
    { id: "e8",  name: "Air Conditioner",   location: "Bedroom",     tag: "EL-008", lastSeen: "Yesterday",  status: "found"   },
    { id: "e9",  name: "Bluetooth Speaker", location: "Living Room", tag: "EL-009", lastSeen: "3h ago",     status: "found"   },
    { id: "e10", name: "Microwave Oven",    location: "Kitchen",     tag: "EL-010", lastSeen: "1h ago",     status: "found"   },
  ],
  medicine: [
    { id: "m1",  name: "Paracetamol",       location: "Bathroom",    tag: "MD-001", lastSeen: "2 days ago", status: "found"   },
    { id: "m2",  name: "First Aid Kit",     location: "Kitchen",     tag: "MD-002", lastSeen: "1 week ago", status: "found"   },
    { id: "m3",  name: "Vitamin D",         location: "Kitchen",     tag: "MD-003", lastSeen: "Yesterday",  status: "found"   },
    { id: "m4",  name: "Blood Pressure Meds",location:"Bedroom",     tag: "MD-004", lastSeen: "Today",      status: "found"   },
    { id: "m5",  name: "Allergy Tablets",   location: "Bathroom",    tag: "MD-005", lastSeen: "3 days ago", status: "missing" },
    { id: "m6",  name: "Thermometer",       location: "Bathroom",    tag: "MD-006", lastSeen: "2 weeks ago",status: "found"   },
    { id: "m7",  name: "Antiseptic Cream",  location: "Bathroom",    tag: "MD-007", lastSeen: "1 month ago",status: "found"   },
    { id: "m8",  name: "Eye Drops",         location: "Bathroom",    tag: "MD-008", lastSeen: "1 week ago", status: "found"   },
    { id: "m9",  name: "Painkillers",       location: "Bathroom",    tag: "MD-009", lastSeen: "Yesterday",  status: "found"   },
  ],
  clothes: [
    { id: "c1",  name: "Winter Jackets",    location: "Wardrobe",    tag: "CL-001", lastSeen: "2 months ago",status: "packed"  },
    { id: "c2",  name: "Formal Suits",      location: "Wardrobe",    tag: "CL-002", lastSeen: "1 week ago", status: "found"   },
    { id: "c3",  name: "Summer Clothes",    location: "Box #02",     tag: "CL-003", lastSeen: "Yesterday",  status: "packed"  },
    { id: "c4",  name: "Gym Wear",          location: "Bedroom",     tag: "CL-004", lastSeen: "2 days ago", status: "found"   },
    { id: "c5",  name: "Kids Clothes",      location: "Guest Room",  tag: "CL-005", lastSeen: "3 days ago", status: "packed"  },
    { id: "c6",  name: "Shoes (6 pairs)",   location: "Hallway",     tag: "CL-006", lastSeen: "Yesterday",  status: "found"   },
    { id: "c7",  name: "Bedsheets",         location: "Box #08",     tag: "CL-007", lastSeen: "2 days ago", status: "packed"  },
  ],
  kitchen: [
    { id: "k1",  name: "Cutlery Set",       location: "Kitchen",     tag: "KI-001", lastSeen: "1h ago",     status: "found"   },
    { id: "k2",  name: "Pots & Pans",       location: "Kitchen",     tag: "KI-002", lastSeen: "3h ago",     status: "found"   },
    { id: "k3",  name: "Dinner Plates (12)",location: "Kitchen",     tag: "KI-003", lastSeen: "Yesterday",  status: "found"   },
    { id: "k4",  name: "Coffee Maker",      location: "Kitchen",     tag: "KI-004", lastSeen: "2h ago",     status: "found"   },
    { id: "k5",  name: "Blender",           location: "Kitchen",     tag: "KI-005", lastSeen: "3 days ago", status: "found"   },
    { id: "k6",  name: "Spice Rack",        location: "Kitchen",     tag: "KI-006", lastSeen: "1h ago",     status: "found"   },
    { id: "k7",  name: "Wine Glasses (6)",  location: "Dining Room", tag: "KI-007", lastSeen: "1 week ago", status: "found"   },
    { id: "k8",  name: "Pressure Cooker",   location: "Kitchen",     tag: "KI-008", lastSeen: "Yesterday",  status: "found"   },
    { id: "k9",  name: "Toaster",           location: "Kitchen",     tag: "KI-009", lastSeen: "2h ago",     status: "found"   },
  ],
};

const INVENTORY_CATEGORIES: InventoryCategory[] = [
  { id: "rooms",       label: "Rooms",         count: 12, icon: <Home            className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "boxes",       label: "Boxes",          count: 42, icon: <Package         className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "furniture",   label: "Furniture",      count: 28, icon: <Armchair        className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "documents",   label: "Documents",      count: 15, icon: <Files           className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "electronics", label: "Electronics",    count: 18, icon: <Monitor         className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "medicine",    label: "Medicine",       count: 9,  icon: <Pill            className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "clothes",     label: "Clothes",        count: 34, icon: <Shirt           className="w-7 h-7" strokeWidth={1.5} /> },
  { id: "kitchen",     label: "Kitchen Items",  count: 22, icon: <UtensilsCrossed className="w-7 h-7" strokeWidth={1.5} /> },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:   { opacity: 0, y: 18, scale: 0.97 },
  visible:  { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const STATUS_STYLES: Record<string, string> = {
  found:   "bg-green-400/20  text-green-700  dark:text-green-400",
  missing: "bg-red-400/20    text-red-700    dark:text-red-400",
  packed:  "bg-blue-400/20   text-blue-700   dark:text-blue-400",
};

export function InventoryScreen() {
  const [query, setQuery]             = useState("");
  const [selected, setSelected]       = useState<InventoryCategory | null>(null);
  const [itemQuery, setItemQuery]     = useState("");

  const filtered = INVENTORY_CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const items = selected
    ? (CATEGORY_ITEMS[selected.id] ?? []).filter((i) =>
        i.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(itemQuery.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-5">
      <AnimatePresence mode="wait">

        {/* ── Category grid ─────────────────────────────────── */}
        {!selected && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Search */}
            <div className="w-full flex items-center gap-3 px-4 h-11 sm:h-12 rounded-full bg-white/25 dark:bg-white/[0.07] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-sm">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories..."
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
              />
            </div>

            {/* Grid */}
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((cat) => (
                <motion.button
                  key={cat.id}
                  variants={cardVariants}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setSelected(cat); setItemQuery(""); }}
                  className="relative flex flex-col justify-between p-4 sm:p-5 aspect-square rounded-[24px] bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:bg-white/30 dark:hover:bg-white/[0.10] transition-all duration-200 text-left group overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 w-fit">
                    {cat.icon}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight">{cat.label}</span>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{cat.count} items</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Category detail (item list) ───────────────────── */}
        {selected && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Back + search */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/10 text-slate-700 dark:text-white hover:bg-white/50 transition-all shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center gap-2 px-4 h-10 rounded-full bg-white/25 dark:bg-white/[0.07] backdrop-blur-2xl border border-white/30 dark:border-white/10">
                <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={itemQuery}
                  onChange={(e) => setItemQuery(e.target.value)}
                  placeholder={`Search in ${selected.label}...`}
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none font-medium"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              {[
                { label: "Total",   value: items.length,                             color: "text-slate-800 dark:text-white" },
                { label: "Found",   value: items.filter(i => i.status === "found").length,   color: "text-green-600 dark:text-green-400" },
                { label: "Packed",  value: items.filter(i => i.status === "packed").length,  color: "text-blue-600  dark:text-blue-400"  },
                { label: "Missing", value: items.filter(i => i.status === "missing").length, color: "text-red-600   dark:text-red-400"   },
              ].map((s) => (
                <div key={s.label} className="flex-1 flex flex-col items-center py-3 rounded-2xl bg-white/20 dark:bg-white/[0.06] backdrop-blur-xl border border-white/30 dark:border-white/10">
                  <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Item list */}
            <motion.div
              className="flex flex-col gap-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_1px_8px_rgba(0,0,0,0.05)]"
                >
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.status === "found"   ? "bg-green-500" :
                    item.status === "missing" ? "bg-red-500"   : "bg-blue-500"
                  }`} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px]">{item.lastSeen}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 opacity-40" />
                  <p className="text-sm font-medium">No items found</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
