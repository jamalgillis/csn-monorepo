"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Clock, MapPin, Users, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GameFormData {
  homeTeamId: string;
  awayTeamId: string;
  sportId: string;
  gameDate: string;
  gameTime: string;
  venue: string;
  description?: string;
}

interface GameFormProps {
  initialDate?: Date;
  gameId?: string; // For editing existing games
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function GameForm({ initialDate, gameId, onSuccess, onCancel }: GameFormProps) {
  const [formData, setFormData] = useState<GameFormData>({
    homeTeamId: "",
    awayTeamId: "",
    sportId: "",
    gameDate: initialDate?.toISOString().split('T')[0] || "",
    gameTime: "",
    venue: "",
    description: ""
  });

  const [errors, setErrors] = useState<Partial<GameFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data for form options
  const teams = useQuery(api.sports.getAllTeams) || [];
  const sports = useQuery(api.sports.getAllSports) || [];
  const existingGame = gameId ? useQuery(api.sports.getGameById, { gameId }) : null;

  // Mutations
  const scheduleGame = useMutation(api.sports.scheduleGame);
  const updateGame = useMutation(api.sports.updateGame);

  // Load existing game data for editing
  useEffect(() => {
    if (existingGame) {
      const gameDateTime = new Date(existingGame.game_date);
      setFormData({
        homeTeamId: existingGame.homeTeam._id,
        awayTeamId: existingGame.awayTeam._id,
        sportId: existingGame.sport,
        gameDate: gameDateTime.toISOString().split('T')[0],
        gameTime: gameDateTime.toTimeString().slice(0, 5),
        venue: existingGame.venue || "",
        description: existingGame.description || ""
      });
    }
  }, [existingGame]);

  const handleInputChange = (field: keyof GameFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<GameFormData> = {};

    if (!formData.homeTeamId) newErrors.homeTeamId = "Home team is required";
    if (!formData.awayTeamId) newErrors.awayTeamId = "Away team is required";
    if (!formData.sportId) newErrors.sportId = "Sport is required";
    if (!formData.gameDate) newErrors.gameDate = "Game date is required";
    if (!formData.gameTime) newErrors.gameTime = "Game time is required";
    if (!formData.venue) newErrors.venue = "Venue is required";

    // Validate that home and away teams are different
    if (formData.homeTeamId && formData.awayTeamId && formData.homeTeamId === formData.awayTeamId) {
      newErrors.awayTeamId = "Away team must be different from home team";
    }

    // Validate that game date is not in the past
    const gameDateTime = new Date(`${formData.gameDate}T${formData.gameTime}`);
    if (gameDateTime < new Date() && !gameId) { // Allow past dates when editing
      newErrors.gameDate = "Game date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      const gameDateTime = new Date(`${formData.gameDate}T${formData.gameTime}`);

      const gameData = {
        homeTeamId: formData.homeTeamId,
        awayTeamId: formData.awayTeamId,
        sport: formData.sportId,
        game_date: gameDateTime.toISOString(),
        venue: formData.venue,
        description: formData.description
      };

      if (gameId) {
        await updateGame({ gameId, ...gameData });
      } else {
        await scheduleGame(gameData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving game:", error);
      setErrors({ venue: "Failed to save game. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableAwayTeams = () => {
    return teams.filter(team => team._id !== formData.homeTeamId);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {gameId ? "Edit Game" : "Schedule New Game"}
        </CardTitle>
        <CardDescription>
          {gameId ? "Update game details and schedule" : "Add a new game to the schedule with all necessary details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Teams Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="homeTeam" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Home Team
              </Label>
              <Select
                value={formData.homeTeamId}
                onValueChange={(value) => handleInputChange("homeTeamId", value)}
              >
                <SelectTrigger className={errors.homeTeamId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name} - {team.city}, {team.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.homeTeamId && (
                <p className="text-sm text-destructive">{errors.homeTeamId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="awayTeam">Away Team</Label>
              <Select
                value={formData.awayTeamId}
                onValueChange={(value) => handleInputChange("awayTeamId", value)}
              >
                <SelectTrigger className={errors.awayTeamId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableAwayTeams().map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name} - {team.city}, {team.state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.awayTeamId && (
                <p className="text-sm text-destructive">{errors.awayTeamId}</p>
              )}
            </div>
          </div>

          {/* Sport Selection */}
          <div className="space-y-2">
            <Label htmlFor="sport">Sport</Label>
            <Select
              value={formData.sportId}
              onValueChange={(value) => handleInputChange("sportId", value)}
            >
              <SelectTrigger className={errors.sportId ? "border-destructive" : ""}>
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport._id} value={sport.name}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sportId && (
              <p className="text-sm text-destructive">{errors.sportId}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gameDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Game Date
              </Label>
              <Input
                id="gameDate"
                type="date"
                value={formData.gameDate}
                onChange={(e) => handleInputChange("gameDate", e.target.value)}
                className={errors.gameDate ? "border-destructive" : ""}
              />
              {errors.gameDate && (
                <p className="text-sm text-destructive">{errors.gameDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gameTime" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Game Time
              </Label>
              <Input
                id="gameTime"
                type="time"
                value={formData.gameTime}
                onChange={(e) => handleInputChange("gameTime", e.target.value)}
                className={errors.gameTime ? "border-destructive" : ""}
              />
              {errors.gameTime && (
                <p className="text-sm text-destructive">{errors.gameTime}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <Label htmlFor="venue" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Venue
            </Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              placeholder="Enter venue name and location"
              className={errors.venue ? "border-destructive" : ""}
            />
            {errors.venue && (
              <p className="text-sm text-destructive">{errors.venue}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add any additional notes or special information about the game"
              rows={3}
            />
          </div>

          {/* Error Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors above before submitting.
              </AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {gameId ? "Updating..." : "Scheduling..."}
                </>
              ) : (
                gameId ? "Update Game" : "Schedule Game"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}