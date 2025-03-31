import React, { useState } from 'react';
import { FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AIInventorySuggestions = ({ suggestions }) => {
  const [openSections, setOpenSections] = useState({
    'High Urgency': false,
    'Medium Urgency': false,
    'Low Urgency': false,
    'Additional Notes': false,
  });

  const [expandedItems, setExpandedItems] = useState({});

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleItem = (category, index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`],
    }));
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiAlertCircle className="w-5 h-5 text-blue-500 mr-2" />
        AI Inventory Suggestions
      </h3>

      {Object.keys(suggestions).length === 0 ? (
        <p className="text-gray-500">Loading suggestions...</p>
      ) : (
        <div>
          {['High Urgency', 'Medium Urgency', 'Low Urgency'].map((category) => (
            suggestions[category]?.length > 0 && (
              <div key={category} className="mb-4">
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full flex justify-between items-center py-2"
                >
                  <h4
                    className={`font-medium ${
                      category === 'High Urgency'
                        ? 'text-red-600'
                        : category === 'Medium Urgency'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {category}
                  </h4>
                  {openSections[category] ? (
                    <FiChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {openSections[category] && (
                  <div className="pl-5">
                    {suggestions[category].map((suggestion, index) => (
                      <div key={index} className="mb-2">
                        <button
                          onClick={() => toggleItem(category, index)}
                          className="w-full text-left flex justify-between items-center py-1"
                        >
                          <span className="text-gray-700 font-medium">
                            {suggestion.item}
                          </span>
                          {expandedItems[`${category}-${index}`] ? (
                            <FiChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <FiChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        {expandedItems[`${category}-${index}`] && (
                          <p className="text-gray-600 pl-4 mt-1">
                            {suggestion.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}

          {suggestions['Considerations']?.length > 0 && (
            <div>
              <button
                onClick={() => toggleSection('Additional Notes')}
                className="w-full flex justify-between items-center py-2"
              >
                <h4 className="font-medium text-gray-600">Additional Notes</h4>
                {openSections['Additional Notes'] ? (
                  <FiChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {openSections['Additional Notes'] && (
                <div className="pl-5">
                  {suggestions['Considerations'].map((note, index) => (
                    <div key={index} className="mb-2">
                      <button
                        onClick={() => toggleItem('Considerations', index)}
                        className="w-full text-left flex justify-between items-center py-1"
                      >
                        <span className="text-gray-700">{note.note.split('.')[0]}</span>
                        {expandedItems[`Considerations-${index}`] ? (
                          <FiChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      {expandedItems[`Considerations-${index}`] && (
                        <p className="text-gray-600 pl-4 mt-1">{note.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInventorySuggestions;