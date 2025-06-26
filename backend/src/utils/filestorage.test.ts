// filestorage.test.ts

import fs from "fs";
import path from "path";
import { readItems, writeItems } from "./filestorage";
import { ILocalItem } from "../Types/ILocalItem";

// Mock the fs module to control file system behavior during tests
jest.mock("fs");
const mockedFs = fs as jest.Mocked<typeof fs>;

// Mock the path module
jest.mock("path");
const mockedPath = path as jest.Mocked<typeof path>;

describe("File Storage Functions", () => {
    const mockFilePath = "/mocked/path/localItems.json";

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock path.join to return our expected file path
        mockedPath.join.mockReturnValue(mockFilePath);

        // Mock __dirname
        (global as any).__dirname = "/mocked/path";
    });

    describe("readItems", () => {
        it("should read and parse valid JSON file successfully", () => {
            // Arrange
            const mockData: ILocalItem[] = [
                {
                    id: "1",
                    name: "Test Restaurant",
                    type: "restaurant",
                    description: "Great local restaurant",
                    location: "123 Main St",
                    rating: 4.5,
                    tags: ["italian", "cozy"],
                    imageUrl: "https://example.com/image1.jpg",
                    isTrending: true,
                    openingHours: { open: "08:00", close: "22:00" },
                    coordinates: { lat: 40.7128, lng: -74.0060 },
                    featuredReview: { author: "John Doe", comment: "Excellent food!", stars: 5 },
                    accessibility: ["wheelchair"],
                    mysteryScore: 85
                },
                {
                    id: "2",
                    name: "Central Park",
                    type: "park",
                    description: "Beautiful city park",
                    location: "Central Park, NY",
                    rating: 4.8,
                    tags: ["nature", "peaceful"],
                    imageUrl: "https://example.com/image2.jpg",
                    isTrending: false,
                    openingHours: { open: "06:00", close: "23:00" },
                    coordinates: { lat: 40.7829, lng: -73.9654 },
                    featuredReview: { author: "Jane Smith", comment: "Perfect for walks", stars: 5 },
                    accessibility: ["wheelchair", "braille"],
                    mysteryScore: 72
                }
            ];
            const mockJsonString = JSON.stringify(mockData);

            mockedFs.readFileSync.mockReturnValue(mockJsonString);

            // Act
            const result = readItems();

            // Assert
            expect(mockedFs.readFileSync).toHaveBeenCalledWith(mockFilePath, "utf-8");
            expect(result).toEqual(mockData);
            expect(result).toHaveLength(2);
        });

        it("should return empty array when file contains empty JSON array", () => {
            // Arrange
            mockedFs.readFileSync.mockReturnValue("[]");

            // Act
            const result = readItems();

            // Assert
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it("should return empty array when file does not exist", () => {
            // Arrange
            mockedFs.readFileSync.mockImplementation(() => {
                const error = new Error("ENOENT: no such file or directory");
                (error as any).code = "ENOENT";
                throw error;
            });

            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Act
            const result = readItems();

            // Assert
            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error reading localItems.json:",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it("should return empty array when JSON is malformed", () => {
            // Arrange
            mockedFs.readFileSync.mockReturnValue("{ invalid json }");
            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Act
            const result = readItems();

            // Assert
            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error reading localItems.json:",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it("should return empty array when file contains null", () => {
            // Arrange
            mockedFs.readFileSync.mockReturnValue("null");

            // Act
            const result = readItems();

            // Assert
            expect(result).toEqual([]);
        });

        it("should handle file read permission errors", () => {
            // Arrange
            mockedFs.readFileSync.mockImplementation(() => {
                const error = new Error("EACCES: permission denied");
                (error as any).code = "EACCES";
                throw error;
            });

            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Act
            const result = readItems();

            // Assert
            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe("writeItems", () => {
        it("should write items to file successfully", () => {
            // Arrange
            const mockItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Test Cafe",
                    type: "cafe",
                    description: "Cozy coffee shop",
                    location: "456 Oak Ave",
                    rating: 4.2,
                    tags: ["coffee", "wifi"],
                    imageUrl: "https://example.com/cafe.jpg",
                    isTrending: false,
                    openingHours: { open: "07:00", close: "19:00" },
                    coordinates: { lat: 40.7580, lng: -73.9855 },
                    featuredReview: { author: "Mike Johnson", comment: "Great coffee!", stars: 4 },
                    accessibility: ["wheelchair"],
                    mysteryScore: 68
                },
                {
                    id: "2",
                    name: "Art Museum",
                    type: "museum",
                    description: "Modern art collection",
                    location: "789 Culture St",
                    rating: 4.7,
                    tags: ["art", "culture", "educational"],
                    imageUrl: "https://example.com/museum.jpg",
                    isTrending: true,
                    openingHours: { open: "10:00", close: "18:00" },
                    coordinates: { lat: 40.7614, lng: -73.9776 },
                    featuredReview: { author: "Sarah Wilson", comment: "Amazing exhibits!", stars: 5 },
                    accessibility: ["wheelchair", "braille", "audio_guide"],
                    mysteryScore: 91
                }
            ];
            const expectedJsonString = JSON.stringify(mockItems, null, 2);

            mockedFs.writeFileSync.mockImplementation(() => { });

            // Act
            writeItems(mockItems);

            // Assert
            expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
                mockFilePath,
                expectedJsonString
            );
        });

        it("should write empty array successfully", () => {
            // Arrange
            const mockItems: ILocalItem[] = [];
            const expectedJsonString = JSON.stringify(mockItems, null, 2);

            mockedFs.writeFileSync.mockImplementation(() => { });

            // Act
            writeItems(mockItems);

            // Assert
            expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
                mockFilePath,
                expectedJsonString
            );
        });

        it("should handle write errors gracefully", () => {
            // Arrange
            const mockItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Beach Bar",
                    type: "bar",
                    description: "Oceanfront bar",
                    location: "Beach Rd",
                    rating: 4.0,
                    tags: ["beach", "drinks", "sunset"],
                    imageUrl: "https://example.com/beach-bar.jpg",
                    isTrending: true,
                    openingHours: { open: "12:00", close: "02:00" },
                    coordinates: { lat: 25.7617, lng: -80.1918 },
                    featuredReview: { author: "Alex Brown", comment: "Perfect sunset spot!", stars: 4 },
                    accessibility: [],
                    mysteryScore: 78
                }
            ];

            mockedFs.writeFileSync.mockImplementation(() => {
                const error = new Error("ENOSPC: no space left on device");
                (error as any).code = "ENOSPC";
                throw error;
            });

            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Act
            writeItems(mockItems);

            // Assert
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error writing to localItems.json:",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it("should handle permission denied errors", () => {
            // Arrange
            const mockItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Historic Library",
                    type: "library",
                    description: "Century-old library",
                    location: "Historic District",
                    rating: 4.6,
                    tags: ["books", "history", "quiet"],
                    imageUrl: "https://example.com/library.jpg",
                    isTrending: false,
                    openingHours: { open: "09:00", close: "20:00" },
                    coordinates: { lat: 40.7505, lng: -73.9934 },
                    featuredReview: { author: "Emma Davis", comment: "Beautiful architecture!", stars: 5 },
                    accessibility: ["wheelchair", "braille"],
                    mysteryScore: 82
                }
            ];

            mockedFs.writeFileSync.mockImplementation(() => {
                const error = new Error("EACCES: permission denied");
                (error as any).code = "EACCES";
                throw error;
            });

            const consoleSpy = jest.spyOn(console, "error").mockImplementation();

            // Act
            writeItems(mockItems);

            // Assert
            expect(consoleSpy).toHaveBeenCalledWith(
                "Error writing to localItems.json:",
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });

        it("should format JSON with proper indentation", () => {
            // Arrange
            const mockItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Night Market",
                    type: "market",
                    description: "Vibrant evening market",
                    location: "Downtown Plaza",
                    rating: 4.3,
                    tags: ["food", "shopping", "nightlife"],
                    imageUrl: "https://example.com/market.jpg",
                    isTrending: true,
                    openingHours: { open: "18:00", close: "24:00" },
                    coordinates: { lat: 40.7282, lng: -74.0776 },
                    featuredReview: { author: "Carlos Martinez", comment: "Amazing street food!", stars: 4 },
                    accessibility: ["wheelchair"],
                    mysteryScore: 75
                }
            ];

            mockedFs.writeFileSync.mockImplementation(() => { });

            // Act
            writeItems(mockItems);

            // Assert
            const expectedCall = mockedFs.writeFileSync.mock.calls[0];
            const writtenJson = expectedCall[1] as string;

            // Check that the JSON is properly formatted with 2-space indentation
            expect(writtenJson).toContain("[\n  {\n    \"id\": \"1\"");
        });
    });

    describe("Integration scenarios", () => {
        it("should handle round-trip read/write operations", () => {
            // Arrange
            const originalItems: ILocalItem[] = [
                {
                    id: "1",
                    name: "Secret Garden",
                    type: "secret_spot",
                    description: "Hidden rooftop garden",
                    location: "Behind the old building",
                    rating: 4.9,
                    tags: ["hidden", "peaceful", "rooftop"],
                    imageUrl: "https://example.com/secret-garden.jpg",
                    isTrending: false,
                    openingHours: { open: "sunrise", close: "sunset" },
                    coordinates: { lat: 40.7589, lng: -73.9851 },
                    featuredReview: { author: "Local Explorer", comment: "My favorite hidden spot!", stars: 5 },
                    accessibility: [],
                    mysteryScore: 95
                },
                {
                    id: "2",
                    name: "Underground Jazz Club",
                    type: "bar",
                    description: "Authentic jazz atmosphere",
                    location: "Basement entrance on 5th St",
                    rating: 4.4,
                    tags: ["jazz", "music", "underground", "vintage"],
                    imageUrl: "https://example.com/jazz-club.jpg",
                    isTrending: true,
                    openingHours: { open: "20:00", close: "03:00" },
                    coordinates: { lat: 40.7500, lng: -73.9900 },
                    featuredReview: { author: "Jazz Lover", comment: "Incredible live music!", stars: 5 },
                    accessibility: [],
                    mysteryScore: 88
                }
            ];

            // Mock write operation
            mockedFs.writeFileSync.mockImplementation(() => { });

            // Mock read operation to return what was "written"
            mockedFs.readFileSync.mockImplementation(() => {
                return JSON.stringify(originalItems, null, 2);
            });

            // Act
            writeItems(originalItems);
            const readResult = readItems();

            // Assert
            expect(readResult).toEqual(originalItems);
        });

        it("should handle large datasets", () => {
            // Arrange
            const largeDataset: ILocalItem[] = Array.from({ length: 1000 }, (_, i) => ({
                id: i.toString(),
                name: `Location ${i}`,
                type: i % 2 === 0 ? 'restaurant' : 'park',
                description: `Description for location ${i}`,
                location: `Address ${i}`,
                rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
                tags: [`tag${i}`, 'test'],
                imageUrl: `https://example.com/image${i}.jpg`,
                isTrending: i % 10 === 0,
                openingHours: { open: "09:00", close: "18:00" },
                coordinates: { lat: 40.7128 + (i * 0.001), lng: -74.0060 + (i * 0.001) },
                featuredReview: {
                    author: `User ${i}`,
                    comment: `Great place ${i}`,
                    stars: Math.ceil(Math.random() * 5)
                },
                accessibility: i % 3 === 0 ? ['wheelchair'] : [],
                mysteryScore: Math.ceil(Math.random() * 100)
            }));

            mockedFs.writeFileSync.mockImplementation(() => { });
            mockedFs.readFileSync.mockReturnValue(JSON.stringify(largeDataset));

            // Act
            writeItems(largeDataset);
            const result = readItems();

            // Assert
            expect(result).toHaveLength(1000);
            expect(result[0]).toEqual(expect.objectContaining({
                id: "0",
                name: "Location 0",
                type: "restaurant"
            }));
            expect(result[999]).toEqual(expect.objectContaining({
                id: "999",
                name: "Location 999",
                type: "park"
            }));
        });
    });
});

// Additional test file for edge cases and boundary conditions
describe("File Storage Edge Cases", () => {
    const mockFilePath = "/mocked/path/localItems.json";

    beforeEach(() => {
        jest.clearAllMocks();
        mockedPath.join.mockReturnValue(mockFilePath);
        (global as any).__dirname = "/mocked/path";
    });

    it("should handle special characters in item data", () => {
        // Arrange
        const specialItems: ILocalItem[] = [
            {
                id: "1",
                name: "Café with émojis 🚀☕",
                type: "cafe",
                description: "Special chars: àáâãäå ñ ü",
                location: "123 Rué de la Paix",
                rating: 4.2,
                tags: ["café", "spéciaux", "émojis"],
                imageUrl: "https://example.com/café.jpg",
                isTrending: false,
                openingHours: { open: "07:00", close: "19:00" },
                coordinates: { lat: 48.8566, lng: 2.3522 },
                featuredReview: {
                    author: "François",
                    comment: "Très bon café! ☕",
                    stars: 5
                },
                accessibility: ["wheelchair"],
                mysteryScore: 75
            },
            {
                id: "2",
                name: "Restaurant \"The Apostrophe's\" Place",
                type: "restaurant",
                description: "Quotes \"and\" 'apostrophes' with backslashes \\ and newlines \n",
                location: "O'Connor's Street",
                rating: 4.5,
                tags: ["special", "quotes"],
                imageUrl: "https://example.com/restaurant.jpg",
                isTrending: true,
                openingHours: { open: "11:00", close: "23:00" },
                coordinates: { lat: 40.7128, lng: -74.0060 },
                featuredReview: {
                    author: "O'Brien",
                    comment: "Great \"atmosphere\" here!",
                    stars: 4
                },
                accessibility: [],
                mysteryScore: 82
            }
        ];

        mockedFs.writeFileSync.mockImplementation(() => { });
        mockedFs.readFileSync.mockReturnValue(JSON.stringify(specialItems, null, 2));

        // Act
        writeItems(specialItems);
        const result = readItems();

        // Assert
        expect(result).toEqual(specialItems);
    });

    it("should handle items with undefined or null values", () => {
        // Arrange
        const itemsWithNulls: any[] = [
            {
                id: "1",
                name: "Incomplete Item",
                type: "restaurant",
                description: null, // null description
                location: "Unknown Location",
                rating: 4.0,
                tags: ["test"],
                imageUrl: null, // null imageUrl
                isTrending: false,
                openingHours: { open: "09:00", close: "17:00" },
                coordinates: { lat: 40.7128, lng: -74.0060 },
                featuredReview: {
                    author: null, // null author
                    comment: "Good place",
                    stars: 4
                },
                accessibility: [],
                mysteryScore: 50
            },
            {
                id: "2",
                name: null, // null name
                type: "cafe",
                description: "Test description",
                location: "Test Location",
                rating: 3.5,
                tags: [],
                imageUrl: "https://example.com/test.jpg",
                isTrending: true,
                openingHours: undefined, // undefined openingHours
                coordinates: { lat: 40.7128, lng: -74.0060 },
                featuredReview: {
                    author: "Test User",
                    comment: undefined, // undefined comment
                    stars: 3
                },
                accessibility: undefined, // undefined accessibility
                mysteryScore: 60
            }
        ];

        mockedFs.writeFileSync.mockImplementation(() => { });
        // Note: JSON.stringify converts undefined to null or removes undefined properties
        const serializedItems = JSON.parse(JSON.stringify(itemsWithNulls));
        mockedFs.readFileSync.mockReturnValue(JSON.stringify(serializedItems, null, 2));

        // Act
        writeItems(itemsWithNulls);
        const result = readItems();

        // Assert
        expect(result).toEqual(serializedItems);
    });
});
