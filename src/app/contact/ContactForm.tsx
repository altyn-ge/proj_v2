"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { TextArea } from "@/components/TextArea";
import { TextField } from "@/components/TextField";
import { StatusMessage } from "@/components/StatusMessage";
import clsx from "clsx";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setResult(null);
    event.preventDefault();
    setIsSending(true);
    const response = await sendEmail(event.currentTarget);
    if (response.success) {
      event.currentTarget.reset();
    }
    setResult(response.success);
    setIsSending(false);
  }

  return (
    <form ref={formRef} className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <TextField label="Ваше имя*" required name="name" />
      <TextField
        label="Адрес электронной почты*"
        type="email"
        name="email"
        required
      />
      <TextField
        label="Имя убитой женщины"
        name="subject"
        helperText="Если это имя уже есть в списках, пожалуйста, укажите список"
      />
      <TextArea label="Сообщение*" name="message" required />

      <button
        type="submit"
        className={clsx(
          "bg-foreground text-background px-4 py-2 hover:bg-stone-800 disabled:!bg-black/60 transition-colors mt-4 min-w-48 disabled:cursor-not-allowed"
        )}
        disabled={isSending}
      >
        {isSending ? "Oтправка..." : "Oтправить"}
      </button>

      {result === true && <StatusMessage>Сообщение отправлено!</StatusMessage>}
      {result === false && (
        <StatusMessage type="error">
          Невозможно отправить сообщение
        </StatusMessage>
      )}
    </form>
  );
}

async function sendEmail(form: EventTarget & HTMLFormElement) {
  try { 
    const result = await emailjs.sendForm(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      form,
      process.env.EMAILJS_PUBLIC_KEY
    );

    if (result.status === 200) {
      return { success: true };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
}

export function ContactFormNew() {
  const [subject, setSubject] = useState("Выражение благодарности");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setResult(true);
      setIsSending(false);
      e.currentTarget.reset();
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto flex flex-col"
      style={{ fontFamily: 'inherit' }}
    >
      <div className="grid grid-cols-2 items-start">
        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
        <span>Представьтесь <span className="text-red-600">*</span></span>
        </label>
        <input name="name" required className="w-full border rounded px-3 py-2" />

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
          <span>Введите корректный email<span className="text-red-600">*</span></span>
        </label>
        <input name="email" type="email" required className="w-full border rounded px-3 py-2" />

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
          Город/регион
        </label>
        <input name="city" className="w-full border rounded px-3 py-2" />

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
          Организация
        </label>
        <input name="organization" className="w-full border rounded px-3 py-2" />

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
          Должность
        </label>
        <input name="position" className="w-full border rounded px-3 py-2" />

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4">
          <span>Тема<span className="text-red-600">*</span></span>
        </label>
        <select
          name="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Выражение благодарности">Выражение благодарности</option>
          <option value="Исправление ошибки ввода">Исправление ошибки ввода</option>
          <option value="Другое">Другое</option>
        </select>

        <label className="text-lg font-normal text-black flex flex-col gap-2 items-start pr-4 mt-2">
          <span>Ваше сообщение напишите здесь<span className="text-red-600">*</span></span>
        </label>
        <textarea
          name="message"
          required
          className="w-full border rounded px-3 py-2 min-h-[80px]"
        />
      </div>
      <div className="flex items-center gap-8 mt-4">
        <button
          type="submit"
          className="bg-[#a94442] text-white px-8 py-2 rounded hover:bg-[#922d2b] transition-colors min-w-48 text-lg font-semibold disabled:bg-gray-400"
          disabled={isSending}
        >
          {isSending ? "Oтправка..." : "Отправить"}
        </button>
      </div>
      <div className="text-sm mt-2">
        <span>Поля, помеченные звездочкой </span>
        <span className="text-red-600">*</span>
        <span>, должны быть заполнены.</span>
      </div>
      {result === true && (
        <div className="text-green-700 font-semibold mt-2">Сообщение отправлено!</div>
      )}
      {result === false && (
        <div className="text-red-700 font-semibold mt-2">Невозможно отправить сообщение</div>
      )}
    </form>
  );
}
