import { useState, useContext } from 'react';
import './SideBard.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';

function SideBar() {
  const [extended, setExtended] = useState(true);
  const { onSent, prevPrompt, setRecentPrompt, newChat, setPrevprompt, theme, setTheme } = useContext(Context);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const loadPrompt = async (prompt) => {
      setRecentPrompt(prompt);
      await onSent(prompt);
  }

  const deletePrompt = (index) => {
      const updatedPrevPrompt = [...prevPrompt];
      updatedPrevPrompt.splice(index, 1);
      setPrevprompt(updatedPrevPrompt);
  }

  let lastClickedTime = 0;

  const handleDoubleClick = (index) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastClickedTime < 300) {
          deletePrompt(index);
      }
      lastClickedTime = currentTime;
  }

  const handleToggleTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme);
    const root = document.getElementById('root');
    if (theme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
    setShowThemeModal(false);
  };
  return (
      <>
        <div className='sidebar'>
            <div className="top">
                <img className='menu' src={assets.menu_icon} alt="" onClick={() => setExtended(!extended)} />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>新的对话</p> : null}
                </div>
                {extended &&
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        {prevPrompt.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => loadPrompt(item)}
                                onDoubleClick={() => handleDoubleClick(index)}
                                className="recent-entry"
                            >
                                <img src={assets.message_icon} alt="" />
                                <p>{item.slice(0, 18)}...</p>
                                <img src={assets.trash} onClick={() => deletePrompt(index)} alt='Delete' />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="bottom">
                {/* <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div> */}
                <div className="bottom">
                    <div className="bottom-item recent-entry" onClick={() => setShowThemeModal(true)}>
                        <img src={assets.setting_icon} alt="" />
                        {extended ? <p>全局主题设置</p> : null}
                    </div>
                </div>
            </div>
        </div>
        {showThemeModal && (
          <div className='theme-modal-overlay'>
            <div className='theme-modal'>
              <div className='modal-content'>
                <h3>主题设置</h3>
                <div className='theme-options'>
                  <button onClick={() => handleToggleTheme('light')}>浅色主题</button>
                  <button onClick={() => handleToggleTheme('dark')}>深色主题</button>
                </div>
                <button className='close-btn' onClick={() => setShowThemeModal(false)}>关闭</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
}

export default SideBar;
