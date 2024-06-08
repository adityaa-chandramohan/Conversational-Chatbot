import ChatBot from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";
import React from "react";
import FetchData from "./FetchData";


const MyChatBot = () => {
  function validatePhoneNumber(userInput) {
    // Regular expression patterns for Indian phone numbers
    const mobileNumberPattern = /^[6-9]\d{9}$/;
    const landlineNumberPattern = /^(0\d{2,3})?-?(\d{7,8})$/;

    if (
      mobileNumberPattern.test(userInput) ||
      landlineNumberPattern.test(userInput)
    ) {
      return true; // Valid Indian phone number
    } else {
      return false; // Invalid phone number
    }
  }

  const [form, setForm] = React.useState({});

  const flow = {
    start: {
      message:
        "Thanks for reaching out to us. I am a sales assistant and happy to answer any question you have regarding the product. Please note that we may record this chat for quality assurance purpose. what is your name?",
      chatDisabled: false,
      function: (params) => setForm({ ...form, name: params.userInput }),
      path: "ask_phone",
    },
    ask_phone: {
      message: (params) =>
        `Nice to e-meet you ${params.userInput}, what is your phone number?`,
      chatDisabled: false,
      function: (params) => setForm({ ...form, phone: params.userInput }),
      path: (params) => {
        if (!validatePhoneNumber(params.userInput)) {
          params.injectMessage(
            "Please enter a valid land line or mobile number.",
          );
          return;
        }
        return "ask_que";
      },
    },
    ask_que: {
      message: "How may I help you?",
      chatDisabled: false,
      function: (params) => setForm({ ...form, que: params.userInput }),
      path: "ask_chatgpt",
    },
    ask_chatgpt: {
      message: async () => {
        try {
          const result = await FetchData(form.que, form.name, form.phone);
          return result;
        } catch (error) {
          return "An error occurred while fetching data.";
        }
      },
      transition: { duration: 3000 },
      path: "check_user",
    },
    check_user: {
      message: "is your question addressed?",
      options: ["Yes", "No"],
      function: (params) =>
        setForm({ ...form, user_response: params.userInput }),
      path: (params) => {
        if (params.userInput === "Yes") {
          return "end";
        } else {
          return "ask_que";
        }
      },
    },

    end: {
      message:
        "Thank you for your interest in our product, we will get back to you shortly!",
      options: ["New Chat"],
      chatDisabled: true,
      path: "start",
    },
  };

  return (
    <ChatBot
      options={{
        isOpen: false,
        chatButton:{icon: "https://img.icons8.com/color/48/chat--v1.png"},
        theme: {
          showHeader: true,
          showFooter: false,
          showInputRow: true,
          embedded: false,
          mobileEnabled: true,
          desktopEnabled: true,
        },
        audio: { disabled: true },
        chatHistory: { disabled: false, maxEntries: 2 },
        header: { closeChatIcon: true, title: "Chat bot", showAvatar: true },
        tooltip: { mode: "CLOSE", text: "Talk to our Sales Rep" },
        userBubble: { showAvatar: true },
        fileAttachment: { disabled: true },
        ChatInput: {
          enabledPlaceholderText: "Please type here",
          showCharacterCount: true,
        },
        botBubble: { showAvatar: true },
        notification: { disabled: true },
        tooltipStyle: { PictureInPictureWindow: false },
      }}
      flow={flow}
    />
  );
};

export default MyChatBot;
