import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Bug, Zap, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

interface ReleaseNote {
    id: string;
    type: 'feature' | 'bugfix' | 'improvement' | 'breaking';
    title: string;
    description: string;
}

interface ReleaseNotesData {
    version: string;
    release_date: string;
    summary: string;
    highlights: string[];
    notes: ReleaseNote[];
}

interface ReleaseNotesEditorProps {
    initialData?: Partial<ReleaseNotesData>;
    version: string;
    onSave: (data: ReleaseNotesData) => void;
    onCancel: () => void;
    className?: string;
}

const RELEASE_NOTE_TYPES = [
    {
        value: 'feature',
        label: '✨ New Feature',
        icon: <Sparkles className="w-4 h-4 text-green-600" />,
        color: 'bg-green-50 border-green-200'
    },
    {
        value: 'improvement',
        label: '⚡ Improvement',
        icon: <Zap className="w-4 h-4 text-blue-600" />,
        color: 'bg-blue-50 border-blue-200'
    },
    {
        value: 'bugfix',
        label: '🐛 Bug Fix',
        icon: <Bug className="w-4 h-4 text-yellow-600" />,
        color: 'bg-yellow-50 border-yellow-200'
    },
    {
        value: 'breaking',
        label: '💥 Breaking Change',
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
        color: 'bg-red-50 border-red-200'
    }
];

// Generate unique ID for release notes
const generateId = () => `rn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ReleaseNotesEditor: React.FC<ReleaseNotesEditorProps> = ({
                                                                   initialData,
                                                                   version,
                                                                   onSave,
                                                                   onCancel,
                                                                   className = ''
                                                               }) => {
    const [releaseData, setReleaseData] = useState<ReleaseNotesData>({
        version,
        release_date: new Date().toISOString().split('T')[0],
        summary: '',
        highlights: [''],
        notes: [],
        ...initialData
    });

    const addNote = () => {
        const newNote: ReleaseNote = {
            id: generateId(),
            type: 'feature',
            title: '',
            description: ''
        };
        setReleaseData(prev => ({
            ...prev,
            notes: [...prev.notes, newNote]
        }));
    };

    const updateNote = (noteId: string, field: keyof ReleaseNote, value: any) => {
        setReleaseData(prev => ({
            ...prev,
            notes: prev.notes.map(note =>
                note.id === noteId ? { ...note, [field]: value } : note
            )
        }));
    };

    const deleteNote = (noteId: string) => {
        setReleaseData(prev => ({
            ...prev,
            notes: prev.notes.filter(note => note.id !== noteId)
        }));
    };

    const addHighlight = () => {
        setReleaseData(prev => ({
            ...prev,
            highlights: [...prev.highlights, '']
        }));
    };

    const updateHighlight = (index: number, value: string) => {
        setReleaseData(prev => ({
            ...prev,
            highlights: prev.highlights.map((h, i) => i === index ? value : h)
        }));
    };

    const removeHighlight = (index: number) => {
        setReleaseData(prev => ({
            ...prev,
            highlights: prev.highlights.filter((_, i) => i !== index)
        }));
    };

    const handleSave = () => {
        const cleanedData = {
            ...releaseData,
            highlights: releaseData.highlights.filter(h => h.trim() !== '')
        };
        onSave(cleanedData);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Release Notes Editor</h2>
                    <p className="text-gray-600">Version {version}</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Release Notes
                    </Button>
                </div>
            </div>

            {/* Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Release Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        label="Summary"
                        value={releaseData.summary}
                        onChange={(e) => setReleaseData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Brief summary of what's included in this release..."
                        rows={3}
                    />

                    <Input
                        label="Release Date"
                        type="date"
                        value={releaseData.release_date}
                        onChange={(e) => setReleaseData(prev => ({ ...prev, release_date: e.target.value }))}
                    />
                </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Key Highlights</CardTitle>
                        <Button variant="outline" size="sm" onClick={addHighlight} leftIcon={<Plus className="w-4 h-4" />}>
                            Add Highlight
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {releaseData.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <Input
                                    value={highlight}
                                    onChange={(e) => updateHighlight(index, e.target.value)}
                                    placeholder="Key highlight or major change..."
                                    className="flex-1"
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeHighlight(index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {releaseData.highlights.length === 0 && (
                            <p className="text-gray-500 text-sm italic">No highlights added yet</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Release Notes */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Release Notes</CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addNote}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Note
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {releaseData.notes.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No release notes yet</p>
                            <Button onClick={addNote} leftIcon={<Plus className="w-4 h-4" />}>
                                Add Your First Note
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {releaseData.notes.map((note) => {
                                const noteType = RELEASE_NOTE_TYPES.find(t => t.value === note.type);
                                return (
                                    <Card key={note.id} className={`border-2 ${noteType?.color}`}>
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        {noteType?.icon}
                                                        <Select
                                                            value={note.type}
                                                            onChange={(e) => updateNote(note.id, 'type', e.target.value)}
                                                            options={RELEASE_NOTE_TYPES.map(type => ({
                                                                value: type.value,
                                                                label: type.label
                                                            }))}
                                                            className="w-48"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteNote(note.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <Input
                                                    label="Title"
                                                    value={note.title}
                                                    onChange={(e) => updateNote(note.id, 'title', e.target.value)}
                                                    placeholder="Brief title describing the change"
                                                />

                                                <Textarea
                                                    label="Description"
                                                    value={note.description}
                                                    onChange={(e) => updateNote(note.id, 'description', e.target.value)}
                                                    placeholder="Detailed description of the change"
                                                    rows={3}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview */}
            {releaseData.notes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Version {releaseData.version} Release Notes
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Released on {new Date(releaseData.release_date).toLocaleDateString()}
                            </p>

                            {releaseData.summary && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Summary</h4>
                                    <p className="text-gray-700">{releaseData.summary}</p>
                                </div>
                            )}

                            {releaseData.highlights.filter(h => h.trim()).length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Key Highlights</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {releaseData.highlights.filter(h => h.trim()).map((highlight, index) => (
                                            <li key={index} className="text-gray-700">{highlight}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {RELEASE_NOTE_TYPES.map(type => {
                                const notes = releaseData.notes.filter(note => note.type === type.value);
                                if (notes.length === 0) return null;

                                return (
                                    <div key={type.value} className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            {type.icon}
                                            <span>{type.label.replace(/^[^\s]+\s/, '')}</span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {notes.map(note => (
                                                <li key={note.id} className="border-l-4 border-gray-300 pl-4">
                                                    <div className="font-medium text-gray-900">{note.title}</div>
                                                    <div className="text-gray-700 text-sm">{note.description}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ReleaseNotesEditor;