import React from 'react';
import { Calendar, Search, Phone, MessageCircle, Star, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Book Service',
      description: 'Find and book a service',
      link: '/serviceInfo',
      color: 'bg-white hover:bg-gray-200'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Search Services',
      description: 'Browse all available services',
      link: '/serviceInfo',
      color: 'bg-gray-700 hover:bg-gray-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Emergency',
      description: '24/7 emergency services',
      link: '/serviceInfo',
      color: 'bg-gray-800 hover:bg-gray-700'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Support',
      description: 'Get help and support',
      action: 'chat',
      color: 'bg-gray-600 hover:bg-gray-500'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-gray-600/50">
      <h3 className="text-2xl font-black text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          action.link ? (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-black p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h4 className="font-bold mb-1">{action.title}</h4>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
            </Link>
          ) : (
            <button
              key={index}
              className={`${action.color} text-white p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg group`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h4 className="font-bold mb-1">{action.title}</h4>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default QuickActions;