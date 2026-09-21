export function countBy(list, key) {
  const map = {};

  for (let i = 0; i < list.length; i++) {
    const value = list[i][key] || "Other";
    if (!map[value]) {
      map[value] = 0;
    }
    map[value] = map[value] + 1;
  }

  const rows = [];
  const keys = Object.keys(map);

  for (let i = 0; i < keys.length; i++) {
    rows.push({
      name: keys[i],
      value: map[keys[i]]
    });
  }

  return rows;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthKeys() {
  return ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];
}

function monthLabel(key) {
  const month = Number(key.split("-")[1]) - 1;
  return monthNames[month];
}

export function monthlyJoins(users) {
  const keys = monthKeys();
  const rows = [];

  for (let i = 0; i < keys.length; i++) {
    let joins = 0;
    for (let j = 0; j < users.length; j++) {
      if (String(users[j].createdAt).slice(0, 7) === keys[i]) {
        joins = joins + 1;
      }
    }
    rows.push({
      name: monthLabel(keys[i]),
      joins: joins
    });
  }

  return rows;
}

export function growthLine(users) {
  const joins = monthlyJoins(users);
  const rows = [];
  let total = 0;

  for (let i = 0; i < joins.length; i++) {
    total = total + joins[i].joins;
    rows.push({
      name: joins[i].name,
      team: total,
      joins: joins[i].joins
    });
  }

  return rows;
}

export function roleTrend(users) {
  const keys = monthKeys();
  const rows = [];

  for (let i = 0; i < keys.length; i++) {
    let admin = 0;
    let moderator = 0;
    let user = 0;

    for (let j = 0; j < users.length; j++) {
      if (String(users[j].createdAt).slice(0, 7) === keys[i]) {
        if (users[j].role === "admin") {
          admin = admin + 1;
        } else if (users[j].role === "moderator") {
          moderator = moderator + 1;
        } else {
          user = user + 1;
        }
      }
    }

    rows.push({
      name: monthLabel(keys[i]),
      admin: admin,
      moderator: moderator,
      user: user
    });
  }

  return rows;
}

export function activityLine() {
  return [
    { name: "Mon", active: 28, sessions: 41 },
    { name: "Tue", active: 32, sessions: 48 },
    { name: "Wed", active: 36, sessions: 52 },
    { name: "Thu", active: 30, sessions: 44 },
    { name: "Fri", active: 40, sessions: 61 },
    { name: "Sat", active: 18, sessions: 22 },
    { name: "Sun", active: 14, sessions: 17 }
  ];
}
