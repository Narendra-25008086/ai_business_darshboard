import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import butter, filtfilt

st.title("🔊 Noise Filter Simulator")

# Controls (sliders)
freq = st.slider("Frequency (Hz)", 1, 20, 5)
noise_level = st.slider("Noise Level", 0.1, 1.0, 0.5)
cutoff = st.slider("Cutoff Frequency", 1, 20, 10)

# Time axis
t = np.linspace(0, 1, 1000)

# Signal
signal = np.sin(2 * np.pi * freq * t)
noisy = signal + np.random.normal(0, noise_level, t.shape)

# Filter
def lowpass(data, cutoff, fs=1000):
    b, a = butter(4, cutoff / (0.5 * fs), btype='low')
    return filtfilt(b, a, data)

filtered = lowpass(noisy, cutoff)

# Plot
fig, ax = plt.subplots()
ax.plot(t, signal, label="Original")
ax.plot(t, noisy, alpha=0.5, label="Noisy")
ax.plot(t, filtered, linewidth=2, label="Filtered")
ax.legend()
ax.set_title("Noise Filter Simulator")

# Footer
fig.text(0.5, 0.01, "Made by Narendra Krishnan KS (AIML)",
         ha="center", fontsize=10, alpha=0.7)

st.pyplot(fig)