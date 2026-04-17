export const DUMMY_PROFILES = Array.from({ length: 100 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Arun Dev", "Rahul Sethi", "Sana Maryam", "Zayan F.", "Anita Nair", "Vikas Menon", "Deepika R.", "Karan Johar", 
    "Meera Das", "Aditya V.", "Sneha P.", "Rohan S.", "Priya M.", "Arjun K.", "Ishaan B.", "Ananya G.", 
    "Sanya V.", "Kabir D.", "Zara H.", "Ayan K.", "Riya S.", "Noah J.", "Mila K.", "Liam P.", "Ava R.",
    "Ethan S.", "Chloe B.", "Jack M.", "Sophie L.", "Leo V.", "Mia G.", "Lucas D.", "Emma W.", "Oliver H.",
    "Zara R.", "Aarav P.", "Vihaan S.", "Ishani K.", "Myra D.", "Siddharth V.", "Ishita B.", "Tanmay G.",
    "Kiara S.", "Advait K.", "Risha M.", "Kabir J.", "Shanaya V.", "Rishabh P.", "Nandini S.", "Reyansh D.",
    "Amara K.", "Zayd F.", "Inaya M.", "Aryan R.", "Kyra S.", "Vivaan V.", "Saira B.", "Shaurya G.", "Anvika K.",
    "Aahan D.", "Navya S.", "Hridaan P.", "Ira V.", "Ranveer S.", "Tanisha K.", "Reyansh G.", "Avni D.", "Ishir V.",
    "Vedika S.", "Atharv K.", "Zoya M.", "Rudra P.", "Amaira V.", "Saanvi G.", "Yuvraj D.", "Kavya S.", "Arnav K.",
    "Aparna M.", "Madhav P.", "Prisha V.", "Aadiv S.", "Navya G.", "Krish D.", "Shanaya S.", "Rohan K.", "Anjali M.",
    "Sameer P.", "Nisha V.", "Varun S.", "Esha G.", "Dev D.", "Tara S.", "Ayush K.", "Aditi M.", "Pranav P.",
    "Rani V.", "Aakash S.", "Neha G.", "Sumit D.", "Roshni S."
  ][i % 100],
  company: [
    "TechNode Solutions", "ScaleHub", "HEDGE Logistics", "MSME Kerala", "Global Trade Co.", "Retail Matrix", 
    "Green Pack", "FinStrat", "Alpha Services", "Mega Wholesale", "InnoTech", "Skyline Devi", "Terra Firma",
    "Nexus Corp", "Vivid Media", "Zenith Hub", "Quark Labs", "Pinnacle Group", "Apex Partners", "Summit Solutions",
    "EcoTrade", "Loom & Leaf", "Iron Works", "Swift Ship", "Blue Chip", "Core Logic", "Data Drive", "Edge Tech",
    "Flow Systems", "Grid Power", "Hydra Tech", "Ion Labs", "Jolt Energy", "Kilo Byte", "Luna Light", "Meta Minds",
    "Nova Star", "Orbit Flow", "Pulse Bio", "Quantum Net", "Relay Link", "Sonic Boom", "Titan Force", "Ultra Vision",
    "Vento Wind", "Wave Lab", "Xeno Tech", "Yield Grow", "Zero Point", "Active Hub", "Bright Idea", "Craft Works",
    "Digital Node", "Evolve Lab", "Fresh Flow", "Growth Grid", "Home Hub", "Inspire Net", "Jump Start", "Kindred Co.",
    "Life Line", "Motion Med", "Natural Net", "Origin Org", "Prime Pro", "Quick Que", "Rapid Run", "Star System",
    "True Tech", "Unity Unit", "Vital Val", "Work Wise", "Xcel X", "Your Young", "Zone Zen", "Aura Air", "Beam Bio",
    "Crest Corp", "Draft Drive", "Elite Eng", "First Firm", "Great Group", "Hold Hub", "Icon Inc", "Just Jet",
    "Key Kraft", "Level Lab", "Mind Med", "Nest Net", "Open Org", "Pure Pro", "Quint Que", "Rise Run", "Solid Star",
    "Team Tech", "Urban Unit", "Value Val", "Wild Wise", "Xtra X", "Your Young", "Zone Zen"
  ][i % 100],
  role: ["Founder", "CEO", "Partner", "Operations Lead", "Manager", "Strategist"][i % 6],
  match: Math.floor(Math.random() * 20) + 80, // 80-99
  city: "Trivandrum",
  avatar: `https://i.pravatar.cc/150?u=user${i + 1}`
}));

export const DUMMY_POSTS = [
  ...Array.from({ length: 150 }).map((_, i) => {
    const type = ["Update", "Opportunities", "Hiring", "Partnership", "Meeting"][i % 5];
    const profile = DUMMY_PROFILES[i % 100];
    
    let content = "";
    let budget = undefined;
    
    if (type === "Update") {
      content = [
        "Incredible growth! Our cluster just hit a new milestone.",
        "Expanding our manufacturing unit to the Kochi node.",
        "Honored to receive the MSME Excellence Award this year.",
        "Our team just grew by 20 members. Welcoming new talent!",
        "Completed a successful trade mission to the Bangalore hub."
      ][i % 5];
    } else if (type === "Opportunities") {
      content = [
        "Open tender for bulk eco-friendly packaging material.",
        "Seeking supply chain partners for interstate logistics.",
        "New contract open for wholesale raw cotton supply.",
        "Requesting quotes for 500kW solar panel installation.",
        "Bulk order lead: 10,000 units of recycled paper products."
      ][i % 5];
      budget = `₹${(Math.floor(Math.random() * 50) + 10) * 10000}`;
    } else if (type === "Hiring") {
      content = [
        "Looking for a Senior UI/UX Designer for our hub project.",
        "Hiring Operations Leads for Technopark logistics team.",
        "Sales executive required for our new MSME cluster.",
        "Frontend developer with Next.js expertise wanted.",
        "Seeking an expert in regional trade compliance and legal."
      ][i % 5];
      budget = `₹${(Math.floor(Math.random() * 40) + 40) * 1000}`;
    } else if (type === "Partnership") {
      content = [
        "Seeking joint venture partners for a local delivery hub.",
        "Looking for collaborative bids on the upcoming Metro tender.",
        "Calling all organic farmers: Let's create a trade collective.",
        "Partner with us to scale our regional logistics network.",
        "Interest in co-owning a new co-working hub in Pattom?"
      ][i % 5];
    } else {
      content = [
        "Founder Mixer starting at the Hub Cafe. Let's talk scale!",
        "Strategy session: Navigating new MSME tax policies.",
        "Technopark Coffee Sync: Networking for early-stage teams.",
        "Design Feedback Circle: Reviewing the new dashboard UI.",
        "Virtual Meetup: Kerala digital trade and exports 2026."
      ][i % 5];
    }

    return {
      id: i + 1,
      type,
      author: profile.name,
      authorId: profile.id,
      time: `${(i % 24) + 1}h ago`,
      content,
      budget,
      matchScore: Math.floor(Math.random() * 20) + 80,
      avatar: profile.avatar,
      verified: i % 2 === 0,
      likes: Math.floor(Math.random() * 50) + 10,
      isLiked: i % 3 === 0,
      comments: [
        { id: 101, user: "Arun Dev", text: "This looks like a great opportunity!", time: "1h ago" },
        { id: 102, user: "Sana Maryam", text: "Sent you a DM regarding this.", time: "45m ago" }
      ]
    };
  })
];

export const DUMMY_MARKET = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  item: [
    "Eco-Packaging", "Bulk LED Panels", "Logistics Fleet", "Server Rack", "Office Furniture", 
    "Solar Panels", "Water Purifiers", "Raw Cotton", "Industrial Pumps", "Storage Tanks",
    "Digital Signage", "HVAC Systems", "Security Cameras", "Office Supplies", "Workstations",
    "Projectors", "Printers", "Coffee Machines", "Delivery Vans", "Generators"
  ][i % 20],
  category: ["Raw Material", "Electronics", "Lease", "IT Asset", "Manufacturing", "Energy"][i % 6],
  price: `₹${(Math.floor(Math.random() * 90) + 10) * 1000}`,
  cap: ["1,000 Units", "Wholesale", "Per Vehicle", "Full Set", "Monthly Lease"][i % 5],
  image: `https://images.unsplash.com/photo-${[
    "1589939705384-5185137a7f0f", "1542393545-10f5cde2c810", "1586528116311-ad8dd3c8310d", 
    "1558494949-ef010cbdcc51", "1518455027359-f3f8164ba6bd"
  ][i % 5]}?q=80&w=300`
}));

export const DUMMY_CHATS = DUMMY_PROFILES.slice(0, 15).map((p, i) => ({
  id: p.id,
  name: p.name,
  last: [
    "The UI looks incredible!", "Are we meeting today?", "Order dispatched.", 
    "Sent you the proposal.", "Can we call at 3?", "Got the shipment.", 
    "Thanks for the match!", "Will check and get back.", "Price seems okay.", 
    "Let's finalize.", "Sent the payment.", "Checking for leads.", 
    "Any updates?", "Awesome work!", "Let's catch up."
  ][i % 15],
  time: `${i + 1}m`,
  online: i % 3 === 0,
  avatar: p.avatar
}));
