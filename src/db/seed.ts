import fs from "node:fs";
import { faker } from "@faker-js/faker";

const TENANT_ID = "org_demo_123";

function generateSeed() {
	let sql = "";

	// Projects
	for (let i = 0; i < 50; i++) {
		const name = faker.company.name();
		const budget = faker.number.int({ min: 10000, max: 1000000 });
		const status = faker.helpers.arrayElement([
			"active",
			"completed",
			"on-hold",
		]);
		sql += `INSERT INTO projects (tenant_id, name, budget, status) VALUES ('${TENANT_ID}', '${name.replace(/'/g, "''")}', ${budget}, '${status}');\n`;
	}

	// Employees
	for (let i = 0; i < 100; i++) {
		const name = faker.person.fullName();
		const role = faker.person.jobTitle();
		sql += `INSERT INTO employees (tenant_id, name, role) VALUES ('${TENANT_ID}', '${name.replace(/'/g, "''")}', '${role.replace(/'/g, "''")}');\n`;
	}

	// Inventory
	for (let i = 0; i < 200; i++) {
		const name = faker.commerce.productName();
		const quantity = faker.number.int({ min: 0, max: 1000 });
		const price = faker.number.int({ min: 10, max: 5000 });
		sql += `INSERT INTO inventory (tenant_id, item_name, quantity, price) VALUES ('${TENANT_ID}', '${name.replace(/'/g, "''")}', ${quantity}, ${price});\n`;
	}

	fs.writeFileSync("seed.sql", sql);
	console.log("Seed SQL generated in seed.sql");
}

generateSeed();
