import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext"; 

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    skills: Yup.array().of(Yup.string().required('Skill is required')),
    projects: Yup.array().of(
        Yup.object().shape({
            title: Yup.string().required('Project title required'),
            description: Yup.string().required('Description required'),
        })
    ),
    certificates: Yup.array().of(
        Yup.object().shape({
            name: Yup.string(),
            issuer: Yup.string(),
        })
    ),
    achievements: Yup.array().of(Yup.string()),
    extracurricular: Yup.array().of(Yup.string()),
    education: Yup.array().of(
        Yup.object().shape({
            school: Yup.string().required(),
            degree: Yup.string().required(),
            year: Yup.string().required(),
        })
    ),
    experience: Yup.array().of(
        Yup.object().shape({
            company: Yup.string(),
            position: Yup.string(),
            duration: Yup.string(),
        })
    )
});

const ResumeBuilder = () => {
    const navigate = useNavigate();
    const { resumeData, setResumeData } = useResume(); 
    const { user, setUser } = useAuth();

    
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: resumeData || {
            name: '',
            email: '',
            phone: '',
            education: [{ school: '', degree: '', year: '' }],
            experience: [{ company: '', position: '', duration: '' }],
            skills: [''],
            projects: [{ title: '', description: '' }],
            certificates: [{ name: '', issuer: '' }],
            achievements: [''],
            extracurricular: [''],
        },
    });

    const skills = watch("skills") || [];
    const achievements = watch("achievements") || [];
    const extracurricular = watch("extracurricular") || [];

    const { fields: eduFields, append: appendEdu } = useFieldArray({ control, name: 'education' });
    const { fields: expFields, append: appendExp } = useFieldArray({ control, name: 'experience' });
    const { fields: projectFields, append: appendProject } = useFieldArray({ control, name: 'projects' });
    const { fields: certificateFields, append: appendCertificate } = useFieldArray({ control, name: 'certificates' });

    const [image, setImage] = useState(null);

    
    useEffect(() => {
        const subscription = watch((value) => {
            setResumeData(value); 
        });
        return () => subscription.unsubscribe();
    }, [watch, setResumeData]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        if (image) formData.append("image", image);
        formData.append("resumeData", JSON.stringify(data));

        try {
            const res = await axios.post(
                "https://careercompanion-backend-mgbo.onrender.com/api/resume/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
            );

            const savedResume = res.data.resume;

            
            const updatedUser = { ...user, resume: savedResume };
            setUser(updatedUser);

            alert("Resume saved successfully!");
        } catch (error) {
            console.error("Error saving resume:", error);
            alert("Failed to save resume");
        }
    };

   
    const downloadPDF = async () => {
        const data = resumeData || watch(); 
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(data.name || '', 20, 20);
        doc.setFontSize(12);
        doc.text(`${data.email || ''} | ${data.phone || ''}`, 20, 30);

        let currentY = 40;

        const sections = [
            { title: 'Education', items: data.education || [], head: [['School', 'Degree', 'Year']], map: (e) => [e.school || '', e.degree || '', e.year || ''] },
            { title: 'Experience', items: data.experience || [], head: [['Company', 'Position', 'Duration']], map: (e) => [e.company || '', e.position || '', e.duration || ''] },
            { title: 'Skills', items: data.skills || [], map: (s) => [s || ''] },
            { title: 'Projects', items: data.projects || [], head: [['Title', 'Description']], map: (p) => [p.title || '', p.description || ''] },
            { title: 'Achievements', items: data.achievements || [], map: (a) => [a || ''] },
            { title: 'Certificates', items: data.certificates || [], head: [['Name', 'Issuer']], map: (c) => [c.name || '', c.issuer || ''] },
            { title: 'Extracurricular', items: data.extracurricular || [], map: (e) => [e || ''] },
        ];

        sections.forEach(sec => {
            if (sec.items.length > 0) {
                doc.text(sec.title + ':', 20, currentY);
                autoTable(doc, {
                    startY: currentY + 5,
                    head: sec.head,
                    body: sec.items.map(sec.map),
                });
                currentY = doc.lastAutoTable.finalY + 10;
            }
        });

        if (image) {
            const reader = new FileReader();
            reader.onload = function (e) {
                doc.addImage(e.target.result, 'JPEG', 150, 15, 30, 30);
                doc.save(`${data.name || 'Resume'}_Resume.pdf`);
            };
            reader.readAsDataURL(image);
        } else {
            doc.save(`${data.name || 'Resume'}_Resume.pdf`);
        }
    };


    

    const analyzeWithAI = () => {
        navigate("/resume-analyzer", {
            state: {
                resumeText: `
      Name: ${resumeData.name}
      Email: ${resumeData.email}
      Phone: ${resumeData.phone}
      Education: ${JSON.stringify(resumeData.education ?? [])}
      Experience: ${JSON.stringify(resumeData.experience ?? [])}
      Skills: ${(resumeData.skills ?? []).join(", ")}
      Projects: ${JSON.stringify(resumeData.projects ?? [])}
      Certificates: ${JSON.stringify(resumeData.certificates ?? [])}
      Achievements: ${(resumeData.achievements ?? []).join(", ")}
      Extracurricular: ${(resumeData.extracurricular ?? []).join(", ")}
      `
            }
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white shadow-lg p-8 rounded-lg max-w-4xl mx-auto space-y-8"
            >
                <h1 className="text-3xl font-bold text-center text-blue-700">
                    Resume Builder
                </h1>

                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Personal Information
                    </h2>
                    <input
                        {...register("name")}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-red-500">{errors.name?.message}</p>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-red-500">{errors.email?.message}</p>
                    <input
                        {...register("phone")}
                        placeholder="Phone"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-red-500">{errors.phone?.message}</p>
                    <label className="block font-medium">Upload Profile Image</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Education</h2>
                    {eduFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-4 mb-3">
                            <input
                                {...register(`education.${index}.school`)}
                                placeholder="School"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`education.${index}.degree`)}
                                placeholder="Degree"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`education.${index}.year`)}
                                placeholder="Year"
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendEdu({ school: "", degree: "", year: "" })}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Education
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Experience</h2>
                    {expFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-4 mb-3">
                            <input
                                {...register(`experience.${index}.company`)}
                                placeholder="Company"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`experience.${index}.position`)}
                                placeholder="Position"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`experience.${index}.duration`)}
                                placeholder="Duration"
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            appendExp({ company: "", position: "", duration: "" })
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Experience
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Skills</h2>
                    {skills.map((_, index) => (
                        <div key={index} className="flex gap-4 mb-2">
                            <input
                                {...register(`skills.${index}`)}
                                placeholder="Skill"
                                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setValue("skills", [...skills, ""])}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Skill
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Projects</h2>
                    {projectFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-2 gap-4 mb-3">
                            <input
                                {...register(`projects.${index}.title`)}
                                placeholder="Project Title"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`projects.${index}.description`)}
                                placeholder="Description"
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendProject({ title: "", description: "" })}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Project
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Certificates</h2>
                    {certificateFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-2 gap-4 mb-3">
                            <input
                                {...register(`certificates.${index}.name`)}
                                placeholder="Certificate Name"
                                className="px-3 py-2 border rounded-md"
                            />
                            <input
                                {...register(`certificates.${index}.issuer`)}
                                placeholder="Issuer"
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendCertificate({ name: "", issuer: "" })}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Certificate
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Achievements</h2>
                    {achievements.map((_, index) => (
                        <div key={index} className="flex gap-4 mb-2">
                            <input
                                {...register(`achievements.${index}`)}
                                placeholder="Achievement"
                                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setValue("achievements", [...achievements, ""])}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Achievement
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                        Extracurricular Activities
                    </h2>
                    {extracurricular.map((_, index) => (
                        <div key={index} className="flex gap-4 mb-2">
                            <input
                                {...register(`extracurricular.${index}`)}
                                placeholder="Activity"
                                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setValue("extracurricular", [...extracurricular, ""])
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                        + Add Activity
                    </button>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Save Resume
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit(downloadPDF)()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                    >
                        Download PDF
                    </button>
                    

                </div>
            </form>
            
        </div>
    );
};

export default ResumeBuilder;
