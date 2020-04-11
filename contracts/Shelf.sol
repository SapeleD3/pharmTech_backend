pragma solidity ^0.5.0;

contract Shelf {
    uint public categoryCount = 0;
    uint public drugCount = 0;

    struct Category {
        uint id;
        string catName;
    }

    mapping(uint => Category) public categories;

    event CategoryCreated(
        uint id,
        string catName
    );

    function createCategory(string memory _catName) public {
        categoryCount ++;
        categories[categoryCount] = Category(categoryCount, _catName);
        emit CategoryCreated(categoryCount, _catName);
    }
    struct Drugs {
        uint id;
        string drugName;
        string catName;
    }

    mapping(uint => Drugs) public drugs;

    event CategoryCreated(
        uint id,
        string drugName,
        string catName
    );

    function createDrugs(string memory _drugName, string memory _catName) public {
        drugCount ++;
        drugs[drugCount] = Drugs(drugCount, _drugName, _catName);
        emit CategoryCreated(drugCount, _drugName, _catName);
    }
}