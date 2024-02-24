import { useState, useContext, useRef, useEffect } from 'react';
import styles from './main-page.module.scss';
import { NumContext } from '../services/page-context.js';
import ReactLoading from 'react-loading';
import sendBtn from '../../assets/arrowUpIcon.png';

const MainPage = () => {
    const { mainVisible } = useContext(NumContext);

    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: `Hi, I'm ChatGPT! Ask me anything!`, sender: 'ChatGPT' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [chatBtnDisabled, setChatBtnDisabled] = useState(false);
    const chatInput = useRef();
    const chatWindow = useRef();
    const lastMessageRef = useRef(null);
    const { chatVisible, setChatVisible, iconVisible } = useContext(NumContext);

    useEffect(() => {
        // Очистка сообщений при монтировании компонента
        setMessages([
            { text: `Hi, I'm ChatGPT! Ask me anything!`, sender: 'ChatGPT' },
        ]);
    }, []);

    useEffect(() => {
        if (inputMessage.length >= 1) {
            setChatBtnDisabled(true);
        } else {
            setChatBtnDisabled(false);
        }
    }, [inputMessage]);

    const processMessageToChatGPT = async (message) => {
        setIsTyping(true);

        try {
            const apiRequestBody = {
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": message }],
                temperature: 0.7,
                max_tokens: 1000
            };

            const response = await fetch("https://2543463-yo82697.twc1.net/openai-api/chat/normal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiRequestBody),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const responseData = await response.json();

            return responseData;
        } catch (error) {
            console.error('Error processing message to ChatGPT:', error.message);
            throw error;
        } finally {
            setIsTyping(false);
        }
    };

    // ...

    const handleSendRequest = async () => {
        setInputMessage('');
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: inputMessage, sender: 'user' },
        ]);

        try {
            const response = await processMessageToChatGPT(inputMessage);

            if (!response || !response.choices || response.choices.length === 0 || !response.choices[0].message || !response.choices[0].message.content) {
                throw new Error('Invalid response format');
            }

            const replyMessage = response.choices[0].message.content;
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: replyMessage, sender: 'ChatGPT' },
            ]);
        } catch (error) {
            console.error('Error in handleSendRequest:', error);
        }
    };





    const visibleChatHandler = () => {
        setChatVisible(!chatVisible);
    };

    useEffect(() => {
        chatInput.current.focus();
    }, [chatVisible, messages]);

    useEffect(() => {
        if (isTyping === true) {
            chatInput.current.blur();
        }
    }, [isTyping]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && inputMessage.length >= 1) {
            event.preventDefault();
            handleSendRequest();
        }
    };

    useEffect(() => {
        // Прокрутка вниз при появлении новых сообщений
        if (lastMessageRef.current) {
            const newScrollTop = lastMessageRef.current.offsetTop - 200;
            chatWindow.current.scrollTop = newScrollTop;
        }
    }, [messages]);

    return (
        <>


            <div className={`${styles.main_page} ${mainVisible ? '' : styles.hidden}`}>
                <div className={`${styles.main_page__header}`}>
                    ChatGPT
                </div>

                <div className={`${styles.main_page_block__chat}`} ref={chatWindow}>
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className={`${styles.chatGPT_block__chat_element}`} ref={lastMessageRef}>

                            <div className={`${styles.chatMessage} ${msg.sender === 'user' ? styles.userMessage : styles.chatGPTMessage}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}

                </div>

                <div className={`${styles.chatGPT_block__input_block}`}>
                    {isTyping ? (
                        <div className={styles.loadingGPTAnswer}>
                            <ReactLoading type={`bars`} color={`#610ded`} height={'30px'} width={'30px'} />ChatGPT thinking
                        </div>

                    ) : (<div className={styles.hiddenLoadingGPTAnswer}>
                        <ReactLoading type={`bars`} color={`#610ded`} height={'30px'} width={'30px'} />ChatGPT thinking
                    </div>
                    )}

                    <div className={`${styles.chatGPT_block__input_raw}`}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Write message..."
                            className={`${styles.chatGPT_block__input} ${isTyping ? styles.disabled : ''}`}
                            ref={chatInput}
                            onKeyPress={handleKeyPress}
                            maxLength="100"
                        />
                        <img
                            src={sendBtn}
                            alt="Кнопка отправки сообщения"
                            className={`${styles.sendMsgBtn} ${chatBtnDisabled ? '' : styles.disabled} ${isTyping ? styles.disabled : ''
                                }`}
                            onClick={handleSendRequest}
                        ></img>
                    </div>
                </div>

            </div>


        </>
    )
}

export default MainPage


