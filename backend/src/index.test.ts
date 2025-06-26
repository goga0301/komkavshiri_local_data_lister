// index.test.ts

import request from "supertest";
import express from "express";
import { ILocalItem } from "./Types/ILocalItem";
import { readItems, writeItems } from "./utils/filestorage";

// Mock the UUID generator to have predictable IDs in tests
jest.mock("uuid", () => ({
    v4: jest.fn(() => "mock-uuid-1234")
}));

// Mock the file storage functions
jest.mock("./utils/filestorage", () => ({
    readItems: jest.fn(),
    writeItems: jest.fn()
}));

const mockedReadItems = readItems as jest.MockedFunction<typeof readItems>;
const mockedWriteItems = writeItems as jest.MockedFunction<typeof writeItems>;

// Import the app after mocking
import app from "./index"; // You'll need to export the app from index.ts

describe("Local Items API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/local-items", () => {
        it("should return all items", async () => {
            // Arrange
            const mockItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Test Restaurant",
                    type: "restaurant",
                    description: "Great food",
                    location: "123 Main St",
                    rating: 4.5,
                    tags: ["italian", "cozy"],
                    imageUrl: "https://example.com/image.jpg",
                    isTrending: true,
                    openingHours: { open: "08:00", close: "22:00" },
                    coordinates: { lat: 40.7128, lng: -74.0060 },
                    featuredReview: { author: "John", comment: "Excellent!", stars: 5 },
                    accessibility: ["wheelchair"],
                    mysteryScore: 85
                },
                {
                    id: "2",
                    name: "Central Park",
                    type: "park",
                    description: "Beautiful park",
                    location: "Central Park, NY",
                    rating: 4.8,
                    tags: ["nature", "peaceful"],
                    imageUrl: "https://example.com/park.jpg",
                    isTrending: false,
                    openingHours: { open: "06:00", close: "23:00" },
                    coordinates: { lat: 40.7829, lng: -73.9654 },
                    featuredReview: { author: "Jane", comment: "Perfect for walks", stars: 5 },
                    accessibility: ["wheelchair", "braille"],
                    mysteryScore: 72
                }
            ];

            mockedReadItems.mockReturnValue(mockItems);

            // Act & Assert
            const response = await request(app)
                .get("/api/local-items")
                .expect(200);

            expect(response.body).toEqual(mockItems);
            expect(mockedReadItems).toHaveBeenCalledTimes(1);
        });

        it("should return empty array when no items exist", async () => {
            // Arrange
            mockedReadItems.mockReturnValue([]);

            // Act & Assert
            const response = await request(app)
                .get("/api/local-items")
                .expect(200);

            expect(response.body).toEqual([]);
            expect(mockedReadItems).toHaveBeenCalledTimes(1);
        });
    });

    describe("POST /api/local-items", () => {
        it("should create a new item successfully", async () => {
            // Arrange
            const newItemData = {
                name: "New Cafe",
                type: "cafe",
                description: "Cozy coffee shop",
                location: "456 Oak Ave",
                rating: 4.2,
                tags: ["coffee", "wifi"],
                imageUrl: "https://example.com/cafe.jpg",
                isTrending: false,
                openingHours: { open: "07:00", close: "19:00" },
                coordinates: { lat: 40.7580, lng: -73.9855 },
                featuredReview: { author: "Mike", comment: "Great coffee!", stars: 4 },
                accessibility: ["wheelchair"],
                mysteryScore: 68
            };

            const existingItems: ILocalItem[] = [];
            mockedReadItems.mockReturnValue(existingItems);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .post("/api/local-items")
                .send(newItemData)
                .expect(201);

            expect(response.body).toEqual({
                ...newItemData,
                id: "mock-uuid-1234"
            });
            expect(mockedReadItems).toHaveBeenCalledTimes(1);
            expect(mockedWriteItems).toHaveBeenCalledWith([
                { ...newItemData, id: "mock-uuid-1234" }
            ]);
        });

        it("should return 400 when name is missing", async () => {
            // Arrange
            const invalidItemData = {
                type: "cafe",
                description: "Coffee shop",
                coordinates: { lat: 40.7580, lng: -73.9855 }
                // name is missing
            };

            // Act & Assert
            const response = await request(app)
                .post("/api/local-items")
                .send(invalidItemData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Name and coordinates required"
            });
            expect(mockedReadItems).not.toHaveBeenCalled();
            expect(mockedWriteItems).not.toHaveBeenCalled();
        });

        it("should return 400 when coordinates are missing", async () => {
            // Arrange
            const invalidItemData = {
                name: "Test Cafe",
                type: "cafe",
                description: "Coffee shop"
                // coordinates are missing
            };

            // Act & Assert
            const response = await request(app)
                .post("/api/local-items")
                .send(invalidItemData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Name and coordinates required"
            });
            expect(mockedReadItems).not.toHaveBeenCalled();
            expect(mockedWriteItems).not.toHaveBeenCalled();
        });

        it("should add item to existing items list", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "existing-1",
                    name: "Existing Place",
                    type: "restaurant",
                    description: "Existing restaurant",
                    location: "Existing St",
                    rating: 4.0,
                    tags: ["existing"],
                    imageUrl: "https://example.com/existing.jpg",
                    isTrending: false,
                    openingHours: { open: "10:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 50
                }
            ];

            const newItemData = {
                name: "New Place",
                type: "cafe",
                description: "New cafe",
                location: "New St",
                rating: 4.5,
                tags: ["new"],
                imageUrl: "https://example.com/new.jpg",
                isTrending: true,
                openingHours: { open: "08:00", close: "20:00" },
                coordinates: { lat: 40.7500, lng: -73.9500 },
                featuredReview: { author: "Reviewer", comment: "Great!", stars: 5 },
                accessibility: ["wheelchair"],
                mysteryScore: 80
            };

            mockedReadItems.mockReturnValue([...existingItems]);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .post("/api/local-items")
                .send(newItemData)
                .expect(201);

            expect(response.body.id).toBe("mock-uuid-1234");
            expect(mockedWriteItems).toHaveBeenCalledWith([
                ...existingItems,
                { ...newItemData, id: "mock-uuid-1234" }
            ]);
        });
    });

    describe("PUT /api/local-items/:id", () => {
        it("should update an existing item", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "item-1",
                    name: "Old Name",
                    type: "restaurant",
                    description: "Old description",
                    location: "Old location",
                    rating: 4.0,
                    tags: ["old"],
                    imageUrl: "https://example.com/old.jpg",
                    isTrending: false,
                    openingHours: { open: "10:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 50
                }
            ];

            const updateData = {
                name: "Updated Name",
                description: "Updated description",
                rating: 4.5,
                isTrending: true
            };

            mockedReadItems.mockReturnValue([...existingItems]);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .put("/api/local-items/item-1")
                .send(updateData)
                .expect(200);

            const expectedUpdatedItem = {
                ...existingItems[0],
                ...updateData
            };

            expect(response.body).toEqual(expectedUpdatedItem);
            expect(mockedWriteItems).toHaveBeenCalledWith([expectedUpdatedItem]);
        });

        it("should return 404 when item not found", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "item-1",
                    name: "Existing Item",
                    type: "restaurant",
                    description: "Description",
                    location: "Location",
                    rating: 4.0,
                    tags: [],
                    imageUrl: "https://example.com/image.jpg",
                    isTrending: false,
                    openingHours: { open: "10:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 50
                }
            ];

            const updateData = { name: "New Name" };

            mockedReadItems.mockReturnValue(existingItems);

            // Act & Assert
            const response = await request(app)
                .put("/api/local-items/non-existent-id")
                .send(updateData)
                .expect(404);

            expect(response.body).toEqual({
                error: "Item not found"
            });
            expect(mockedWriteItems).not.toHaveBeenCalled();
        });

        it("should handle partial updates", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "item-1",
                    name: "Original Name",
                    type: "cafe",
                    description: "Original description",
                    location: "Original location",
                    rating: 3.5,
                    tags: ["original"],
                    imageUrl: "https://example.com/original.jpg",
                    isTrending: false,
                    openingHours: { open: "08:00", close: "18:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Okay", stars: 3 },
                    accessibility: [],
                    mysteryScore: 60
                }
            ];

            const partialUpdate = { rating: 4.8 }; // Only updating rating

            mockedReadItems.mockReturnValue([...existingItems]);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .put("/api/local-items/item-1")
                .send(partialUpdate)
                .expect(200);

            expect(response.body).toEqual({
                ...existingItems[0],
                rating: 4.8
            });
        });
    });

    describe("DELETE /api/local-items/:id", () => {
        it("should delete an existing item", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "item-1",
                    name: "Item to Delete",
                    type: "restaurant",
                    description: "Will be deleted",
                    location: "Delete St",
                    rating: 4.0,
                    tags: ["delete"],
                    imageUrl: "https://example.com/delete.jpg",
                    isTrending: false,
                    openingHours: { open: "10:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 50
                },
                {
                    id: "item-2",
                    name: "Item to Keep",
                    type: "cafe",
                    description: "Will remain",
                    location: "Keep St",
                    rating: 4.5,
                    tags: ["keep"],
                    imageUrl: "https://example.com/keep.jpg",
                    isTrending: true,
                    openingHours: { open: "08:00", close: "20:00" },
                    coordinates: { lat: 40.7500, lng: -73.9500 },
                    featuredReview: { author: "User", comment: "Great", stars: 5 },
                    accessibility: ["wheelchair"],
                    mysteryScore: 80
                }
            ];

            mockedReadItems.mockReturnValue([...existingItems]);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .delete("/api/local-items/item-1")
                .expect(200);

            expect(response.body).toEqual(existingItems[0]);
            expect(mockedWriteItems).toHaveBeenCalledWith([existingItems[1]]);
        });

        it("should return 404 when item not found", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "item-1",
                    name: "Existing Item",
                    type: "restaurant",
                    description: "Description",
                    location: "Location",
                    rating: 4.0,
                    tags: [],
                    imageUrl: "https://example.com/image.jpg",
                    isTrending: false,
                    openingHours: { open: "10:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 50
                }
            ];

            mockedReadItems.mockReturnValue(existingItems);

            // Act & Assert
            const response = await request(app)
                .delete("/api/local-items/non-existent-id")
                .expect(404);

            expect(response.body).toEqual({
                error: "Item not found"
            });
            expect(mockedWriteItems).not.toHaveBeenCalled();
        });

        it("should handle deleting the last item", async () => {
            // Arrange
            const existingItems: ILocalItem[] = [
                {
                    id: "last-item",
                    name: "Last Item",
                    type: "park",
                    description: "The only item",
                    location: "Only St",
                    rating: 4.0,
                    tags: ["last"],
                    imageUrl: "https://example.com/last.jpg",
                    isTrending: false,
                    openingHours: { open: "06:00", close: "22:00" },
                    coordinates: { lat: 40.7000, lng: -74.0000 },
                    featuredReview: { author: "User", comment: "Good", stars: 4 },
                    accessibility: [],
                    mysteryScore: 60
                }
            ];

            mockedReadItems.mockReturnValue([...existingItems]);
            mockedWriteItems.mockImplementation(() => { });

            // Act & Assert
            const response = await request(app)
                .delete("/api/local-items/last-item")
                .expect(200);

            expect(response.body).toEqual(existingItems[0]);
            expect(mockedWriteItems).toHaveBeenCalledWith([]);
        });
    });

    describe("GET /health", () => {
        it("should return health status", async () => {
            // Act & Assert
            const response = await request(app)
                .get("/health")
                .expect(200);

            expect(response.body).toEqual({
                status: "Backend is healthy"
            });
        });
    });

    describe("Error handling", () => {
        it("should handle file storage errors gracefully", async () => {
            // Arrange
            mockedReadItems.mockImplementation(() => {
                throw new Error("File system error");
            });

            // Act & Assert
            await request(app)
                .get("/api/local-items")
                .expect(500);
        });

        it("should handle invalid JSON in request body", async () => {
            // Act & Assert
            const response = await request(app)
                .post("/api/local-items")
                .send("invalid json")
                .set('Content-Type', 'application/json')
                .expect(400);

            // Express should handle this automatically
        });
    });

    describe("CORS", () => {
        it("should include CORS headers", async () => {
            // Act & Assert
            const response = await request(app)
                .get("/health")
                .expect(200);

            expect(response.headers['access-control-allow-origin']).toBeDefined();
        });
    });
});

// Additional integration tests
describe("API Integration Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle complete CRUD operations", async () => {
        let items: ILocalItem[] = [];

        // Mock file operations to simulate persistent storage
        mockedReadItems.mockImplementation(() => [...items]);
        mockedWriteItems.mockImplementation((newItems) => {
            items = [...newItems];
        });

        const newItem = {
            name: "Integration Test Cafe",
            type: "cafe",
            description: "Test cafe",
            location: "Test St",
            rating: 4.0,
            tags: ["test"],
            imageUrl: "https://example.com/test.jpg",
            isTrending: false,
            openingHours: { open: "08:00", close: "18:00" },
            coordinates: { lat: 40.7000, lng: -74.0000 },
            featuredReview: { author: "Tester", comment: "Good for testing", stars: 4 },
            accessibility: [],
            mysteryScore: 70
        };

        // CREATE
        const createResponse = await request(app)
            .post("/api/local-items")
            .send(newItem)
            .expect(201);

        const createdItem = createResponse.body;
        expect(createdItem.id).toBe("mock-uuid-1234");

        // READ
        const readResponse = await request(app)
            .get("/api/local-items")
            .expect(200);

        expect(readResponse.body).toHaveLength(1);
        expect(readResponse.body[0]).toEqual(createdItem);

        // UPDATE
        const updateData = { name: "Updated Test Cafe", rating: 4.5 };
        const updateResponse = await request(app)
            .put(`/api/local-items/${createdItem.id}`)
            .send(updateData)
            .expect(200);

        expect(updateResponse.body.name).toBe("Updated Test Cafe");
        expect(updateResponse.body.rating).toBe(4.5);

        // DELETE
        const deleteResponse = await request(app)
            .delete(`/api/local-items/${createdItem.id}`)
            .expect(200);

        expect(deleteResponse.body.id).toBe(createdItem.id);

        // Verify deletion
        const finalReadResponse = await request(app)
            .get("/api/local-items")
            .expect(200);

        expect(finalReadResponse.body).toHaveLength(0);
    });
});
