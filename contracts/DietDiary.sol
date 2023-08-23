// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

contract DietDiary {
    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error PermissionDenied();

    /**
     * @dev Calories limit exceeded.
     */
    error CaloriesLimitExceeded();

    /**
     * @dev Event for new a Food Entry.
     */
    event FoodEntryCreated(address indexed _user, uint _calories, uint indexed timestamp);

    address private _owner;
    uint256 private _defaultCalorieLimit;

    /**
     * @dev Daily calorie limit per address
     */
    mapping(address => uint) public calorieLimitPerUser;

    /**
     * @dev Mapping of address' FoodEntries per day
     */
    mapping(address => mapping(uint => mapping(uint => FoodEntry))) userFoodEntries;

    /**
     * @dev Mapping of EntriesCounter per address
     */
    mapping(address => mapping(uint => EntriesCounter)) userEntriesCounter;

    struct FoodEntry {
        uint256 time;
        string name;
        uint calories;
    }

    struct EntriesCounter {
        uint entries;
        uint caloriesCount;
    }

    modifier onlyAdmin() {
        if (_owner != msg.sender) {
            revert PermissionDenied();
        }
        _;
    }

    constructor(uint256 limit) {
        _owner = msg.sender;
        _defaultCalorieLimit = limit;
    }

    function getDayNumber() public view returns (uint) {
        return block.timestamp / 1 days;
    }

    function getCaloriesLimit() public view returns (uint) {
        uint calorieLimit = calorieLimitPerUser[msg.sender];

        if (calorieLimit == 0) {
            return _defaultCalorieLimit;
        }
        return calorieLimit;
    }

    function changeCaloriesLimit(uint256 amount, address user) public onlyAdmin {
        calorieLimitPerUser[user] = amount;
    }

    function addEntry(uint256 calories, string memory name) public {
        uint dayNumber = getDayNumber();

        uint userLimit = getCaloriesLimit();

        EntriesCounter storage foodCounter = userEntriesCounter[msg.sender][dayNumber];

        if (foodCounter.caloriesCount + calories > userLimit) {
            revert CaloriesLimitExceeded();
        }

        FoodEntry storage entry = userFoodEntries[msg.sender][dayNumber][foodCounter.entries];
        entry.time = dayNumber;
        entry.name = name;
        entry.calories = calories;

        foodCounter.entries += 1;
        foodCounter.caloriesCount += calories;

        emit FoodEntryCreated(msg.sender, entry.time, calories);
    }
}
