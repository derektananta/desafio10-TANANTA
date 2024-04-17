import supertest from "supertest"
import { expect } from "chai"
import config from "../../src/config/config.js"
import mongoose from "mongoose"
import { userModel } from "../../src/dao/models/user.model.js"

const { MongoTestURL } = config
const url = supertest("http://localhost:8080")

let user = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    age: 25,
    password: 'password123',
    carts: [],
    rol: 'user',
    documents: [
        { name: 'docname1', ref: 'proof_of_residence' },
        { name: 'docname2', ref: 'identification' },
        { name: 'docname3', ref: 'bank_statement' }
    ],
    last_connection: '2024-03-06T12:00:00Z'
};

let newUser
let uid


describe("User router test", () => {

    before(function () {
        mongoose.connect(MongoTestURL)
    })

    beforeEach(function () {
        this.timeout(5000)
    })

    it("test 1 - Create User w/ documents", async function () {
        this.timeout(5000);
        newUser = await userModel.create(user)
        console.log(newUser)
        uid = newUser._id
    })

    it("Test 2 - [POST] /api/users/premium/:uid Change user rol", async function () {
        this.timeout(5000);

        const testUser = await url.post(`/api/users/premium/${uid}`);

        expect(testUser.statusCode).to.be.eql(200);
        expect(testUser.body.status).to.equal('success');
        expect(testUser.body.message).to.equal('User rol updated successfully');
        expect(testUser.body.user.rol).to.equal('premium');
    });

    after(function () {
        mongoose.connection.close()
        mongoose.connection.collection("users").drop()
    })

})

