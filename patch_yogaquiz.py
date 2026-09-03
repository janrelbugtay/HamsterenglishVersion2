import re

with open('src/views/YogaQuiz.tsx', 'r') as f:
    content = f.read()

replacement1 = """        return [
            "Gemini_Generated_Image_8sdnyn8sdnyn8sdn.png",
            "Gemini_Generated_Image_40k1j140k1j140k1.png",
            "Gemini_Generated_Image_f2iu2ef2iu2ef2iu.png",
            "Gemini_Generated_Image_fdwj35fdwj35fdwj.png",
            "Gemini_Generated_Image_hdkz3whdkz3whdkz.png",
            "Gemini_Generated_Image_l660sql660sql660.png",
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552286450-37604ce41539?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588286840104-a4b5ff54c4c1?q=80&w=400&auto=format&fit=crop"
        ];"""
target1 = """        return [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1552286450-37604ce41539?q=80&w=400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1588286840104-a4b5ff54c4c1?q=80&w=400&auto=format&fit=crop"
        ];"""

content = content.replace(target1, replacement1)

target2 = """    const [poseImages, setPoseImages] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('yogaPoseImages');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return Array(6).fill('');
    });"""
replacement2 = """    const [poseImages, setPoseImages] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('yogaPoseImages');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return [
            "Gemini_Generated_Image_8sdnyn8sdnyn8sdn.png",
            "Gemini_Generated_Image_40k1j140k1j140k1.png",
            "Gemini_Generated_Image_f2iu2ef2iu2ef2iu.png",
            "Gemini_Generated_Image_fdwj35fdwj35fdwj.png",
            "Gemini_Generated_Image_hdkz3whdkz3whdkz.png",
            "Gemini_Generated_Image_l660sql660sql660.png"
        ];
    });"""
content = content.replace(target2, replacement2)

with open('src/views/YogaQuiz.tsx', 'w') as f:
    f.write(content)
print("Patched successfully")
